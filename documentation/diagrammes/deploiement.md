# Diagramme de Déploiement

## Vue d'ensemble de l'infrastructure

```mermaid
graph TB
    subgraph "Zone Internet"
        Internet[Internet]
        CDN[CDN CloudFlare]
        DNS[Route 53 DNS]
    end

    subgraph "Zone DMZ"
        WAF[Web Application Firewall]
        LB[Load Balancer<br/>Nginx]
        API_GW[API Gateway]
    end

    subgraph "Zone Application - Cluster Kubernetes"
        subgraph "Namespace: production"
            subgraph "Pods API"
                API1[API NestJS<br/>Pod 1]
                API2[API NestJS<br/>Pod 2]
                API3[API NestJS<br/>Pod 3]
            end
            
            subgraph "Pods Frontend"
                WEB1[React Admin<br/>Pod 1]
                WEB2[React Admin<br/>Pod 2]
                FIELD1[React Terrain<br/>Pod 1]
                FIELD2[React Terrain<br/>Pod 2]
            end
            
            subgraph "Pods Services"
                AUTH[Auth Service]
                NOTIF[Notification Service]
                WORKER1[Worker Pod 1]
                WORKER2[Worker Pod 2]
            end
        end
        
        subgraph "Services Kubernetes"
            SVC_API[Service API<br/>ClusterIP]
            SVC_WEB[Service Web<br/>NodePort]
            INGRESS[Ingress Controller]
        end
    end

    subgraph "Zone Données"
        subgraph "Cluster PostgreSQL"
            PG_PRIMARY[(PostgreSQL<br/>Primary)]
            PG_REPLICA1[(PostgreSQL<br/>Replica 1)]
            PG_REPLICA2[(PostgreSQL<br/>Replica 2)]
        end
        
        subgraph "Cluster Redis"
            REDIS_MASTER[(Redis Master)]
            REDIS_SLAVE1[(Redis Slave 1)]
            REDIS_SLAVE2[(Redis Slave 2)]
            REDIS_SENTINEL[Redis Sentinel]
        end
        
        RABBITMQ[RabbitMQ<br/>Cluster]
        S3[Object Storage<br/>MinIO/S3]
    end

    subgraph "Zone Monitoring"
        PROMETHEUS[Prometheus]
        GRAFANA[Grafana]
        ELK[ELK Stack<br/>Elasticsearch<br/>Logstash<br/>Kibana]
        ALERT[AlertManager]
    end

    subgraph "Zone Backup"
        BACKUP[Backup Server]
        ARCHIVE[Archive Storage]
    end

    Internet --> CDN
    CDN --> DNS
    DNS --> WAF
    WAF --> LB
    LB --> API_GW
    API_GW --> INGRESS
    
    INGRESS --> SVC_API
    INGRESS --> SVC_WEB
    
    SVC_API --> API1
    SVC_API --> API2
    SVC_API --> API3
    
    SVC_WEB --> WEB1
    SVC_WEB --> WEB2
    SVC_WEB --> FIELD1
    SVC_WEB --> FIELD2
    
    API1 --> PG_PRIMARY
    API2 --> PG_PRIMARY
    API3 --> PG_PRIMARY
    
    PG_PRIMARY --> PG_REPLICA1
    PG_PRIMARY --> PG_REPLICA2
    
    API1 --> REDIS_MASTER
    REDIS_MASTER --> REDIS_SLAVE1
    REDIS_MASTER --> REDIS_SLAVE2
    
    API1 --> RABBITMQ
    WORKER1 --> RABBITMQ
    WORKER2 --> RABBITMQ
    
    API1 --> S3
    NOTIF --> RABBITMQ
    
    API1 --> ELK
    PROMETHEUS --> API1
    GRAFANA --> PROMETHEUS
    ALERT --> PROMETHEUS
    
    PG_PRIMARY --> BACKUP
    BACKUP --> ARCHIVE

    style API1 fill:#e1f5fe
    style API2 fill:#e1f5fe
    style API3 fill:#e1f5fe
    style PG_PRIMARY fill:#f3e5f5
    style REDIS_MASTER fill:#ffebee
```

## Architecture Docker

### Structure des conteneurs

```yaml
# docker-compose.yml pour développement
version: '3.8'

services:
  # Base de données PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: factory_postgres
    environment:
      POSTGRES_DB: factory_db
      POSTGRES_USER: factory_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - factory_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U factory_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis pour cache et sessions
  redis:
    image: redis:7-alpine
    container_name: factory_redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - factory_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # RabbitMQ pour les messages
  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    container_name: factory_rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: factory_mq
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    networks:
      - factory_network

  # API NestJS
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: factory_api
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://factory_user:${DB_PASSWORD}@postgres:5432/factory_db
      REDIS_URL: redis://default:${REDIS_PASSWORD}@redis:6379
      RABBITMQ_URL: amqp://factory_mq:${RABBITMQ_PASSWORD}@rabbitmq:5672
      JWT_SECRET: ${JWT_SECRET}
      AD_URL: ${AD_URL}
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    networks:
      - factory_network
    depends_on:
      - postgres
      - redis
      - rabbitmq
    command: npm run start:dev

  # Admin React
  admin-web:
    build:
      context: ./frontend/admin
      dockerfile: Dockerfile
    container_name: factory_admin
    environment:
      REACT_APP_API_URL: http://api:3000
    volumes:
      - ./frontend/admin:/app
      - /app/node_modules
    ports:
      - "3001:3000"
    networks:
      - factory_network
    depends_on:
      - api

  # Web Terrain React
  field-web:
    build:
      context: ./frontend/field
      dockerfile: Dockerfile
    container_name: factory_field
    environment:
      REACT_APP_API_URL: http://api:3000
    volumes:
      - ./frontend/field:/app
      - /app/node_modules
    ports:
      - "3002:3000"
    networks:
      - factory_network
    depends_on:
      - api

  # MinIO pour le stockage d'objets
  minio:
    image: minio/minio:latest
    container_name: factory_minio
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    networks:
      - factory_network

  # Elasticsearch
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: factory_elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - factory_network

  # Kibana
  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: factory_kibana
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    ports:
      - "5601:5601"
    networks:
      - factory_network
    depends_on:
      - elasticsearch

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: factory_prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    ports:
      - "9090:9090"
    networks:
      - factory_network

  # Grafana
  grafana:
    image: grafana/grafana:latest
    container_name: factory_grafana
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    ports:
      - "3003:3000"
    networks:
      - factory_network
    depends_on:
      - prometheus

networks:
  factory_network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
  minio_data:
  elasticsearch_data:
  prometheus_data:
  grafana_data:
```

## Déploiement Kubernetes

### Configuration des Deployments

```yaml
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: factory-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: factory-api
  template:
    metadata:
      labels:
        app: factory-api
    spec:
      containers:
      - name: api
        image: registry.company.com/factory-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: factory-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: factory-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: factory-api-service
  namespace: production
spec:
  selector:
    app: factory-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: factory-api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: factory-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Configuration Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: factory-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.factory.company.com
    - admin.factory.company.com
    - field.factory.company.com
    secretName: factory-tls
  rules:
  - host: api.factory.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: factory-api-service
            port:
              number: 80
  - host: admin.factory.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: factory-admin-service
            port:
              number: 80
  - host: field.factory.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: factory-field-service
            port:
              number: 80
```

## Pipeline CI/CD

### GitLab CI Configuration

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - security
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  REGISTRY: registry.company.com
  
before_script:
  - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

# Build Stage
build-api:
  stage: build
  script:
    - cd backend
    - docker build -t $REGISTRY/factory-api:$CI_COMMIT_SHA .
    - docker push $REGISTRY/factory-api:$CI_COMMIT_SHA
    - docker tag $REGISTRY/factory-api:$CI_COMMIT_SHA $REGISTRY/factory-api:latest
    - docker push $REGISTRY/factory-api:latest
  only:
    - main
    - develop

build-admin:
  stage: build
  script:
    - cd frontend/admin
    - docker build -t $REGISTRY/factory-admin:$CI_COMMIT_SHA .
    - docker push $REGISTRY/factory-admin:$CI_COMMIT_SHA
  only:
    - main
    - develop

build-field:
  stage: build
  script:
    - cd frontend/field
    - docker build -t $REGISTRY/factory-field:$CI_COMMIT_SHA .
    - docker push $REGISTRY/factory-field:$CI_COMMIT_SHA
  only:
    - main
    - develop

# Test Stage
test-api:
  stage: test
  image: node:18-alpine
  services:
    - postgres:15-alpine
    - redis:7-alpine
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_pass
    DATABASE_URL: postgresql://test_user:test_pass@postgres:5432/test_db
  script:
    - cd backend
    - npm ci
    - npm run test:ci
    - npm run test:e2e
  coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/
  artifacts:
    reports:
      junit: backend/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: backend/coverage/cobertura-coverage.xml

test-frontend:
  stage: test
  image: node:18-alpine
  script:
    - cd frontend/admin
    - npm ci
    - npm run test:ci
    - cd ../field
    - npm ci
    - npm run test:ci
  artifacts:
    reports:
      junit: frontend/*/junit.xml

# Security Stage
security-scan:
  stage: security
  image: 
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy image --severity HIGH,CRITICAL $REGISTRY/factory-api:$CI_COMMIT_SHA
    - trivy image --severity HIGH,CRITICAL $REGISTRY/factory-admin:$CI_COMMIT_SHA
    - trivy image --severity HIGH,CRITICAL $REGISTRY/factory-field:$CI_COMMIT_SHA
  only:
    - main

dependency-check:
  stage: security
  image: owasp/dependency-check:latest
  script:
    - dependency-check --scan . --format HTML --out dependency-check-report
  artifacts:
    paths:
      - dependency-check-report
  only:
    - main

# Deploy Stage
deploy-staging:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context staging
    - kubectl set image deployment/factory-api api=$REGISTRY/factory-api:$CI_COMMIT_SHA -n staging
    - kubectl set image deployment/factory-admin admin=$REGISTRY/factory-admin:$CI_COMMIT_SHA -n staging
    - kubectl set image deployment/factory-field field=$REGISTRY/factory-field:$CI_COMMIT_SHA -n staging
    - kubectl rollout status deployment/factory-api -n staging
    - kubectl rollout status deployment/factory-admin -n staging
    - kubectl rollout status deployment/factory-field -n staging
  environment:
    name: staging
    url: https://staging.factory.company.com
  only:
    - develop

deploy-production:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context production
    - kubectl set image deployment/factory-api api=$REGISTRY/factory-api:$CI_COMMIT_SHA -n production
    - kubectl set image deployment/factory-admin admin=$REGISTRY/factory-admin:$CI_COMMIT_SHA -n production
    - kubectl set image deployment/factory-field field=$REGISTRY/factory-field:$CI_COMMIT_SHA -n production
    - kubectl rollout status deployment/factory-api -n production
    - kubectl rollout status deployment/factory-admin -n production
    - kubectl rollout status deployment/factory-field -n production
  environment:
    name: production
    url: https://factory.company.com
  when: manual
  only:
    - main
```

## Configuration Terraform pour Infrastructure as Code

```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
  backend "s3" {
    bucket = "factory-terraform-state"
    key    = "production/terraform.tfstate"
    region = "eu-west-1"
  }
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "factory-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = true
  enable_dns_hostnames = true

  tags = {
    Environment = "production"
    Project     = "factory-platform"
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.3"

  cluster_name    = "factory-eks"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      desired_size = 3
      min_size     = 2
      max_size     = 10

      instance_types = ["t3.large"]
      
      k8s_labels = {
        Environment = "production"
        Type        = "general"
      }
    }
  }
}

# RDS PostgreSQL
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.1.1"

  identifier = "factory-postgres"

  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.r5.large"
  allocated_storage = 100
  storage_encrypted = true

  db_name  = "factory_db"
  username = "factory_admin"
  port     = "5432"

  vpc_security_group_ids = [module.security_group.security_group_id]
  subnet_ids            = module.vpc.database_subnets

  backup_retention_period = 30
  backup_window          = "03:00-06:00"
  maintenance_window     = "Mon:00:00-Mon:03:00"

  enabled_cloudwatch_logs_exports = ["postgresql"]
  create_cloudwatch_log_group     = true

  tags = {
    Environment = "production"
    Project     = "factory-platform"
  }
}

# ElastiCache Redis
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "factory-redis"
  replication_group_description = "Redis cluster for Factory Platform"
  
  engine               = "redis"
  node_type           = "cache.r6g.large"
  number_cache_clusters = 3
  port                = 6379
  
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.redis.name
  
  security_group_ids = [module.security_group.security_group_id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  snapshot_retention_limit = 7
  snapshot_window         = "03:00-05:00"
  
  tags = {
    Environment = "production"
    Project     = "factory-platform"
  }
}

# S3 Buckets
resource "aws_s3_bucket" "storage" {
  bucket = "factory-platform-storage"

  tags = {
    Environment = "production"
    Project     = "factory-platform"
  }
}

resource "aws_s3_bucket_versioning" "storage" {
  bucket = aws_s3_bucket.storage.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "storage" {
  bucket = aws_s3_bucket.storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

## Monitoring et Alerting

### Configuration Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

rule_files:
  - "alerts/*.yml"

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)

  - job_name: 'factory-api'
    static_configs:
      - targets: ['factory-api:3000']
    metrics_path: '/metrics'

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'node-exporter'
    kubernetes_sd_configs:
      - role: node
```

### Alertes critiques

```yaml
# alerts/critical.yml
groups:
  - name: critical
    rules:
      - alert: APIDown
        expr: up{job="factory-api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "API is down"
          description: "Factory API has been down for more than 1 minute"

      - alert: DatabaseDown
        expr: pg_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "PostgreSQL is down"
          description: "PostgreSQL database is not responding"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 90%"

      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80%"

      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[1h]) > 5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod is crash looping"
          description: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is crash looping"
```

## Stratégie de sauvegarde et récupération

### Script de sauvegarde automatique

```bash
#!/bin/bash
# backup.sh

# Configuration
BACKUP_DIR="/backup/factory-platform"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# PostgreSQL Backup
echo "Starting PostgreSQL backup..."
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/postgres_$DATE.sql.gz

# Redis Backup
echo "Starting Redis backup..."
redis-cli --rdb $BACKUP_DIR/redis_$DATE.rdb

# Files Backup (S3 sync)
echo "Starting files backup..."
aws s3 sync s3://factory-platform-storage $BACKUP_DIR/files_$DATE/

# Kubernetes configurations backup
echo "Backing up Kubernetes configs..."
kubectl get all --all-namespaces -o yaml > $BACKUP_DIR/k8s_resources_$DATE.yaml
kubectl get secrets --all-namespaces -o yaml > $BACKUP_DIR/k8s_secrets_$DATE.yaml

# Clean old backups
echo "Cleaning old backups..."
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete

# Upload to remote storage
echo "Uploading to remote storage..."
aws s3 sync $BACKUP_DIR s3://factory-platform-backups/

echo "Backup completed successfully!"
```

## Sécurité et conformité

### Configuration de sécurité Kubernetes

```yaml
# security-policies.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: factory-api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
      - podSelector:
          matchLabels:
            app: factory-ingress
      ports:
      - protocol: TCP
        port: 3000
  egress:
    - to:
      - podSelector:
          matchLabels:
            app: postgres
      ports:
      - protocol: TCP
        port: 5432
    - to:
      - podSelector:
          matchLabels:
            app: redis
      ports:
      - protocol: TCP
        port: 6379
```

## Métriques de performance cibles

| Métrique | Cible | Seuil d'alerte |
|----------|-------|----------------|
| Disponibilité | 99.9% | < 99.5% |
| Temps de réponse API (p95) | < 200ms | > 500ms |
| Temps de réponse DB (p95) | < 50ms | > 100ms |
| Utilisation CPU | < 70% | > 85% |
| Utilisation mémoire | < 80% | > 90% |
| Taux d'erreur | < 0.1% | > 1% |
| RTO (Recovery Time Objective) | < 1h | N/A |
| RPO (Recovery Point Objective) | < 15min | N/A |