# Spécifications Techniques

## 1. Architecture Technique

### 1.1 Vue d'ensemble
Architecture microservices basée sur :
- **Backend** : NestJS (Node.js/TypeScript)
- **Frontend Admin** : React 18 avec TypeScript
- **Frontend Terrain** : React 18 avec TypeScript
- **Mobile** : Flutter 3.x
- **Base de données** : PostgreSQL 15
- **Cache** : Redis 7
- **Message Queue** : RabbitMQ 3.12
- **Conteneurisation** : Docker & Kubernetes

### 1.2 Stack Technologique Détaillée

#### Backend (API NestJS)
```json
{
  "framework": "NestJS 10.x",
  "runtime": "Node.js 18 LTS",
  "language": "TypeScript 5.x",
  "orm": "TypeORM 0.3.x",
  "validation": "class-validator",
  "authentication": {
    "jwt": "@nestjs/jwt",
    "passport": "@nestjs/passport",
    "ldap": "ldapjs",
    "bcrypt": "bcryptjs"
  },
  "documentation": "Swagger/OpenAPI 3.0",
  "testing": {
    "unit": "Jest",
    "e2e": "Supertest",
    "coverage": "80% minimum"
  },
  "monitoring": {
    "metrics": "prom-client",
    "logging": "winston",
    "tracing": "opentelemetry"
  }
}
```

#### Frontend Admin/Terrain (React)
```json
{
  "framework": "React 18.2",
  "language": "TypeScript 5.x",
  "bundler": "Vite 5.x",
  "state": "Redux Toolkit + RTK Query",
  "routing": "React Router 6",
  "ui": {
    "components": "Material-UI 5",
    "charts": "Recharts",
    "forms": "React Hook Form",
    "tables": "MUI DataGrid"
  },
  "styling": {
    "method": "CSS-in-JS",
    "library": "Emotion"
  },
  "testing": {
    "unit": "Jest + React Testing Library",
    "e2e": "Cypress",
    "coverage": "70% minimum"
  },
  "pwa": {
    "offline": "Workbox",
    "storage": "IndexedDB (Dexie.js)"
  }
}
```

#### Mobile (Flutter)
```yaml
framework: Flutter 3.16+
language: Dart 3.x
state_management: Riverpod 2.0
navigation: GoRouter
local_storage: 
  - Hive (NoSQL)
  - SQLite (relationnnel)
networking: Dio + Retrofit
authentication: flutter_secure_storage
ui_components: Material 3
offline_sync: background_fetch
testing:
  - Unit: flutter_test
  - Integration: integration_test
  - Coverage: 70% minimum
```

## 2. Architecture des Microservices

### 2.1 Services Principaux

#### API Gateway
```typescript
// Configuration API Gateway
{
  service: "api-gateway",
  port: 3000,
  responsibilities: [
    "Routage des requêtes",
    "Rate limiting",
    "Authentification initiale",
    "Agrégation des réponses",
    "Circuit breaker"
  ],
  technologies: [
    "NestJS",
    "Express Gateway",
    "Redis pour cache"
  ],
  endpoints: {
    "/api/auth/*": "auth-service:3001",
    "/api/checklists/*": "checklist-service:3002",
    "/api/submissions/*": "submission-service:3003",
    "/api/reports/*": "report-service:3004",
    "/api/notifications/*": "notification-service:3005"
  }
}
```

#### Auth Service
```typescript
// Service d'authentification
{
  service: "auth-service",
  port: 3001,
  database: "PostgreSQL (users, sessions)",
  cache: "Redis (tokens, sessions)",
  integrations: ["Active Directory", "SMTP", "SMS"],
  api: {
    POST: [
      "/login/ad",
      "/login/jwt",
      "/logout",
      "/refresh",
      "/forgot-password",
      "/reset-password",
      "/verify-otp"
    ],
    GET: [
      "/me",
      "/verify",
      "/permissions"
    ]
  },
  security: {
    password_hashing: "bcrypt (rounds: 12)",
    token_signing: "RS256",
    session_timeout: "8 heures (AD) / 15 min (JWT)",
    rate_limiting: "5 req/min par IP"
  }
}
```

#### Checklist Service
```typescript
// Service de gestion des checklists
{
  service: "checklist-service",
  port: 3002,
  database: "PostgreSQL (checklists, items, templates)",
  cache: "Redis (checklists actives)",
  storage: "S3/MinIO (attachments)",
  features: [
    "CRUD checklists",
    "Versioning",
    "Templates",
    "Import/Export",
    "Validation schemas"
  ],
  events_published: [
    "checklist.created",
    "checklist.published",
    "checklist.assigned",
    "checklist.archived"
  ]
}
```

### 2.2 Communication Inter-Services

#### Synchrone (REST)
```typescript
// Exemple d'appel REST inter-service
class ChecklistService {
  async assignChecklist(checklistId: string, userId: string) {
    // Vérifier l'utilisateur via Auth Service
    const user = await this.httpService.get(
      `http://auth-service:3001/users/${userId}`,
      { headers: { 'X-Internal-Token': process.env.INTERNAL_TOKEN } }
    );
    
    // Créer l'assignation
    const assignment = await this.assignmentRepository.create({
      checklistId,
      userId: user.data.id,
      assignedAt: new Date()
    });
    
    // Publier événement
    await this.eventBus.publish('checklist.assigned', assignment);
    
    return assignment;
  }
}
```

#### Asynchrone (RabbitMQ)
```typescript
// Configuration RabbitMQ
{
  exchanges: {
    "factory.events": {
      type: "topic",
      durable: true
    }
  },
  queues: {
    "notifications.email": {
      durable: true,
      arguments: {
        "x-message-ttl": 3600000,
        "x-max-retries": 3
      }
    },
    "reports.generation": {
      durable: true,
      arguments: {
        "x-max-priority": 10
      }
    }
  },
  bindings: [
    {
      exchange: "factory.events",
      queue: "notifications.email",
      pattern: "*.created"
    },
    {
      exchange: "factory.events", 
      queue: "reports.generation",
      pattern: "submission.approved"
    }
  ]
}
```

## 3. Modèles de Données

### 3.1 Entités TypeORM

#### User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  @Index()
  email: string;

  @Column({ unique: true, nullable: true })
  @Index()
  phone: string;

  @Column({ select: false })
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, unique: true })
  adUsername: string;

  @Column({
    type: 'enum',
    enum: AuthType,
    default: AuthType.JWT
  })
  authType: AuthType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus;

  @ManyToOne(() => Department, { eager: true })
  @JoinColumn()
  department: Department;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' }
  })
  roles: Role[];

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  hasPermission(resource: string, action: string): boolean {
    return this.roles.some(role => 
      role.permissions.some(perm => 
        perm.resource === resource && perm.action === action
      )
    );
  }
}
```

#### Checklist Entity
```typescript
@Entity('checklists')
export class Checklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ChecklistType
  })
  @Index()
  type: ChecklistType;

  @Column({ default: '1.0.0' })
  version: string;

  @Column({ type: 'jsonb' })
  schema: {
    sections: Array<{
      id: string;
      title: string;
      order: number;
      items: string[];
    }>;
    validations: Record<string, any>;
    calculations: Record<string, string>;
  };

  @Column({
    type: 'enum',
    enum: ChecklistStatus,
    default: ChecklistStatus.DRAFT
  })
  @Index()
  status: ChecklistStatus;

  @ManyToOne(() => ChecklistTemplate, { nullable: true })
  template: ChecklistTemplate;

  @OneToMany(() => ChecklistItem, item => item.checklist, {
    cascade: true,
    eager: true
  })
  items: ChecklistItem[];

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ type: 'jsonb', default: {} })
  metadata: {
    tags?: string[];
    category?: string;
    estimatedTime?: number;
    requiredSkills?: string[];
  };

  @Index()
  @Column({ 
    type: 'tsvector', 
    select: false,
    nullable: true 
  })
  searchVector: any;

  @BeforeInsert()
  @BeforeUpdate()
  updateSearchVector() {
    // Mise à jour automatique du vecteur de recherche
    // pour la recherche full-text
  }
}
```

### 3.2 DTOs et Validation

#### Create Checklist DTO
```typescript
export class CreateChecklistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(ChecklistType)
  type: ChecklistType;

  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  items: ChecklistItemDto[];

  @IsUUID()
  @IsOptional()
  templateId?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ChecklistItemDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsEnum(ItemType)
  type: ItemType;

  @IsBoolean()
  @IsOptional()
  required?: boolean = false;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ItemOptionsDto)
  options?: ItemOptionsDto;

  @IsObject()
  @IsOptional()
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };

  @IsObject()
  @IsOptional()
  conditionalLogic?: {
    showIf?: string;
    requiredIf?: string;
  };
}
```

## 4. API REST Specifications

### 4.1 Standards et Conventions

#### URL Structure
```
https://api.factory.com/v1/{resource}/{id}/{sub-resource}

Exemples:
GET    /v1/checklists
GET    /v1/checklists/{id}
POST   /v1/checklists
PUT    /v1/checklists/{id}
DELETE /v1/checklists/{id}
GET    /v1/checklists/{id}/items
POST   /v1/checklists/{id}/assign
```

#### Response Format
```typescript
// Success Response
{
  "success": true,
  "data": T,
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "uuid"
  }
}

// Paginated Response
{
  "success": true,
  "data": T[],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "metadata": {...}
}
```

### 4.2 Endpoints Documentation

#### Authentication Endpoints
```yaml
/api/v1/auth:
  /login/ad:
    post:
      summary: Active Directory login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username: 
                  type: string
                  example: "DOMAIN\\user"
                password:
                  type: string
      responses:
        200:
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken: string
                  refreshToken: string
                  expiresIn: number
                  user: User
        401:
          description: Invalid credentials
        503:
          description: AD service unavailable

  /login/jwt:
    post:
      summary: JWT login with email/phone
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                identifier:
                  type: string
                  example: "user@example.com"
                password:
                  type: string
                deviceId:
                  type: string
                platform:
                  type: string
                  enum: [web, ios, android]
      responses:
        200:
          description: Login successful
        202:
          description: 2FA required
        401:
          description: Invalid credentials
        423:
          description: Account locked
```

## 5. Sécurité

### 5.1 Authentification et Autorisation

#### JWT Configuration
```typescript
// jwt.config.ts
export const jwtConfig = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    publicKey: fs.readFileSync('keys/public.pem'),
    privateKey: fs.readFileSync('keys/private.pem'),
    signOptions: {
      algorithm: 'RS256',
      expiresIn: '15m',
      issuer: 'factory-platform',
      audience: 'factory-users'
    }
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    signOptions: {
      algorithm: 'HS256',
      expiresIn: '7d'
    }
  },
  verification: {
    algorithms: ['RS256', 'HS256'],
    ignoreExpiration: false,
    clockTolerance: 30 // secondes
  }
};
```

#### Guards et Intercepteurs
```typescript
// Auth Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private cacheService: CacheService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    // Vérifier blacklist
    const isBlacklisted = await this.cacheService.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Vérifier le token
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    // Vérifier les permissions
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );

    if (requiredPermissions) {
      const user = request.user;
      const hasPermission = requiredPermissions.every(permission => 
        user.permissions.includes(permission)
      );

      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }

  private extractToken(request: Request): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return token;
  }
}
```

### 5.2 Protection des Données

#### Chiffrement
```typescript
// Encryption Service
@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

  encrypt(text: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(data: EncryptedData): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(data.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));
    
    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

## 6. Performance et Optimisation

### 6.1 Caching Strategy

#### Multi-Level Cache
```typescript
// Cache Configuration
{
  L1_CACHE: {
    type: "memory",
    ttl: 60, // secondes
    max: 100 // entrées
  },
  L2_CACHE: {
    type: "redis",
    ttl: 3600, // secondes
    keyPrefix: "factory:"
  },
  CACHE_PATTERNS: {
    "checklists:*": {
      ttl: 1800,
      invalidateOn: ["checklist.updated", "checklist.deleted"]
    },
    "user:*:permissions": {
      ttl: 300,
      invalidateOn: ["user.role.changed"]
    },
    "dashboards:*": {
      ttl: 60,
      invalidateOn: ["widget.updated"]
    }
  }
}
```

### 6.2 Database Optimization

#### Query Optimization
```typescript
// Optimized Query avec pagination et eager loading
async findChecklistsWithPagination(
  filters: FilterDto,
  pagination: PaginationDto
): Promise<PaginatedResult<Checklist>> {
  const query = this.checklistRepository
    .createQueryBuilder('checklist')
    .leftJoinAndSelect('checklist.items', 'items')
    .leftJoinAndSelect('checklist.createdBy', 'user')
    .select([
      'checklist.id',
      'checklist.title',
      'checklist.type',
      'checklist.status',
      'checklist.createdAt',
      'user.id',
      'user.firstName',
      'user.lastName',
      'items.id',
      'items.label',
      'items.type'
    ]);

  // Application des filtres
  if (filters.type) {
    query.andWhere('checklist.type = :type', { type: filters.type });
  }

  if (filters.status) {
    query.andWhere('checklist.status = :status', { status: filters.status });
  }

  if (filters.search) {
    query.andWhere(
      'checklist.searchVector @@ plainto_tsquery(:search)',
      { search: filters.search }
    );
  }

  // Pagination
  const [items, total] = await query
    .orderBy('checklist.createdAt', pagination.sortOrder)
    .skip((pagination.page - 1) * pagination.limit)
    .take(pagination.limit)
    .getManyAndCount();

  return {
    items,
    total,
    page: pagination.page,
    totalPages: Math.ceil(total / pagination.limit)
  };
}
```

## 7. Monitoring et Observabilité

### 7.1 Métriques Prometheus
```typescript
// Metrics Service
@Injectable()
export class MetricsService {
  private httpRequestDuration: Histogram<string>;
  private httpRequestTotal: Counter<string>;
  private dbQueryDuration: Histogram<string>;
  private cacheHitRate: Gauge<string>;

  constructor() {
    // Métriques HTTP
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.3, 0.5, 1, 3, 5, 10]
    });

    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status']
    });

    // Métriques DB
    this.dbQueryDuration = new Histogram({
      name: 'db_query_duration_seconds',
      help: 'Duration of database queries',
      labelNames: ['operation', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1]
    });

    // Métriques Cache
    this.cacheHitRate = new Gauge({
      name: 'cache_hit_rate',
      help: 'Cache hit rate percentage',
      labelNames: ['cache_type']
    });

    register.registerMetric(this.httpRequestDuration);
    register.registerMetric(this.httpRequestTotal);
    register.registerMetric(this.dbQueryDuration);
    register.registerMetric(this.cacheHitRate);
  }

  recordHttpRequest(method: string, route: string, status: number, duration: number) {
    this.httpRequestDuration.observe({ method, route, status: status.toString() }, duration);
    this.httpRequestTotal.inc({ method, route, status: status.toString() });
  }

  recordDbQuery(operation: string, table: string, duration: number) {
    this.dbQueryDuration.observe({ operation, table }, duration);
  }

  updateCacheHitRate(cacheType: string, rate: number) {
    this.cacheHitRate.set({ cache_type: cacheType }, rate);
  }
}
```

### 7.2 Logging Structure
```typescript
// Logger Configuration
{
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  defaultMeta: {
    service: 'factory-api',
    environment: process.env.NODE_ENV
  },
  transports: [
    {
      type: 'console',
      format: 'simple',
      level: 'debug'
    },
    {
      type: 'file',
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    },
    {
      type: 'elasticsearch',
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL
      },
      index: 'factory-logs'
    }
  ]
}
```

## 8. Tests et Qualité

### 8.1 Stratégie de Tests

#### Pyramide de Tests
```
         /\
        /E2E\        5%  - Tests End-to-End (Cypress, Appium)
       /------\
      /  Integ  \    15% - Tests d'Intégration (Supertest)
     /------------\
    /   Unit Tests  \ 80% - Tests Unitaires (Jest)
   /------------------\
```

### 8.2 Exemples de Tests

#### Test Unitaire
```typescript
describe('ChecklistService', () => {
  let service: ChecklistService;
  let repository: MockRepository<Checklist>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChecklistService,
        {
          provide: getRepositoryToken(Checklist),
          useClass: MockRepository
        }
      ]
    }).compile();

    service = module.get(ChecklistService);
    repository = module.get(getRepositoryToken(Checklist));
  });

  describe('createChecklist', () => {
    it('should create a checklist with valid data', async () => {
      const dto: CreateChecklistDto = {
        title: 'Test Checklist',
        type: ChecklistType.INSPECTION,
        items: [
          {
            label: 'Item 1',
            type: ItemType.TEXT,
            required: true
          }
        ]
      };

      const expected = {
        id: 'uuid',
        ...dto,
        status: ChecklistStatus.DRAFT
      };

      repository.create.mockReturnValue(expected);
      repository.save.mockResolvedValue(expected);

      const result = await service.create(dto, 'user-id');

      expect(result).toEqual(expected);
      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        createdBy: { id: 'user-id' }
      });
    });

    it('should throw error for invalid data', async () => {
      const dto = {} as CreateChecklistDto;

      await expect(service.create(dto, 'user-id'))
        .rejects
        .toThrow(ValidationException);
    });
  });
});
```

#### Test d'Intégration
```typescript
describe('Checklist API Integration', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();

    // Login pour obtenir le token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      });

    authToken = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /checklists', () => {
    it('should create a checklist', async () => {
      const checklist = {
        title: 'Integration Test Checklist',
        type: 'INSPECTION',
        items: [
          {
            label: 'Test Item',
            type: 'TEXT',
            required: true
          }
        ]
      };

      const response = await request(app.getHttpServer())
        .post('/checklists')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checklist)
        .expect(201);

      expect(response.body.data).toMatchObject({
        title: checklist.title,
        type: checklist.type,
        status: 'DRAFT'
      });
    });

    it('should return 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/checklists')
        .send({})
        .expect(401);
    });
  });
});
```

## 9. Configuration et Environnements

### 9.1 Configuration par Environnement

```typescript
// config/configuration.ts
export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
    poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10
  },
  
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    keyPrefix: 'factory:',
    ttl: 3600
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
    exchanges: {
      events: 'factory.events'
    },
    queues: {
      notifications: 'notifications',
      reports: 'reports'
    },
    prefetch: 10
  },
  
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m'
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    }
  },
  
  ad: {
    url: process.env.AD_URL,
    baseDN: process.env.AD_BASE_DN,
    username: process.env.AD_USERNAME,
    password: process.env.AD_PASSWORD
  },
  
  storage: {
    type: process.env.STORAGE_TYPE || 's3',
    bucket: process.env.STORAGE_BUCKET,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.EMAIL_FROM || 'noreply@factory.com'
  },
  
  sms: {
    provider: process.env.SMS_PROVIDER || 'twilio',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_FROM_NUMBER
  },
  
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV
    },
    prometheus: {
      enabled: process.env.PROMETHEUS_ENABLED === 'true',
      port: parseInt(process.env.PROMETHEUS_PORT, 10) || 9090
    }
  },
  
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 100 // limit each IP to 100 requests per windowMs
  }
});
```

### 9.2 Variables d'Environnement (.env)

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres.factory.internal
DB_PORT=5432
DB_USERNAME=factory_user
DB_PASSWORD=${SECRET_DB_PASSWORD}
DB_NAME=factory_production
DB_POOL_SIZE=20

# Redis
REDIS_HOST=redis.factory.internal
REDIS_PORT=6379
REDIS_PASSWORD=${SECRET_REDIS_PASSWORD}
REDIS_DB=0

# RabbitMQ
RABBITMQ_URL=amqp://factory:${SECRET_RABBITMQ_PASSWORD}@rabbitmq.factory.internal:5672

# JWT Secrets
JWT_ACCESS_SECRET=${SECRET_JWT_ACCESS}
JWT_REFRESH_SECRET=${SECRET_JWT_REFRESH}

# Active Directory
AD_URL=ldaps://ad.company.com:636
AD_BASE_DN=DC=company,DC=com
AD_USERNAME=CN=ServiceAccount,CN=Users,DC=company,DC=com
AD_PASSWORD=${SECRET_AD_PASSWORD}

# Storage
STORAGE_TYPE=s3
STORAGE_BUCKET=factory-production-files
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=${SECRET_AWS_ACCESS_KEY}
AWS_SECRET_ACCESS_KEY=${SECRET_AWS_SECRET_KEY}

# Email
SMTP_HOST=smtp.company.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=factory@company.com
SMTP_PASS=${SECRET_SMTP_PASSWORD}
EMAIL_FROM=Factory Platform <noreply@factory.company.com>

# SMS
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=${SECRET_TWILIO_SID}
TWILIO_AUTH_TOKEN=${SECRET_TWILIO_TOKEN}
TWILIO_FROM_NUMBER=+33612345678

# Monitoring
SENTRY_DSN=${SECRET_SENTRY_DSN}
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090

# Security
ENCRYPTION_KEY=${SECRET_ENCRYPTION_KEY}
INTERNAL_API_KEY=${SECRET_INTERNAL_API_KEY}
```

## 10. Documentation et Maintenance

### 10.1 Documentation API (Swagger)

```typescript
// main.ts - Configuration Swagger
const config = new DocumentBuilder()
  .setTitle('Factory Platform API')
  .setDescription('API pour la plateforme de gestion des données d'usine')
  .setVersion('1.0.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addTag('auth', 'Authentification et autorisation')
  .addTag('checklists', 'Gestion des checklists')
  .addTag('submissions', 'Soumissions et collecte de données')
  .addTag('reports', 'Rapports et analytics')
  .addTag('users', 'Gestion des utilisateurs')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
});
```

### 10.2 Scripts de Maintenance

```json
// package.json - Scripts utilitaires
{
  "scripts": {
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "migration:create": "typeorm migration:create",
    "migration:run": "typeorm migration:run",
    "migration:revert": "typeorm migration:revert",
    "seed:dev": "ts-node scripts/seed-dev-data.ts",
    "backup:db": "ts-node scripts/backup-database.ts",
    "health:check": "ts-node scripts/health-check.ts",
    "docs:generate": "compodoc -p tsconfig.json -s",
    "analyze:bundle": "webpack-bundle-analyzer dist/stats.json"
  }
}
```