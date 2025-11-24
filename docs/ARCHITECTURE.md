# Architecture Générale du Système de Digitalisation d'Usine

## Vue d'ensemble

Ce document présente l'architecture complète de la plateforme de collecte et gestion des données d'usine.

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├──────────────────┬──────────────────┬──────────────────────────┤
│  Admin Web App   │   Web App        │    Mobile App            │
│   (React.js)     │  (React.js)      │    (Flutter)             │
│  - Dashboard     │  - Collecte      │    - Collecte            │
│  - KPI           │  - Formulaires   │    - Formulaires         │
│  - Checklists    │  - Offline       │    - Offline             │
│  - Attribution   │  - Sync          │    - Sync                │
│  - Approbation   │                  │                          │
│                  │                  │                          │
│  Auth: AD        │  Auth: JWT       │    Auth: JWT             │
└────────┬─────────┴────────┬─────────┴──────────┬───────────────┘
         │                  │                    │
         │                  │                    │
         └──────────────────┼────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌───────────────────────────┼────────────────────────────────────┐
│                           │                                     │
│                    API GATEWAY                                  │
│                     (NestJS)                                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Couche d'Authentification                    │ │
│  │  - JWT Strategy (Web/Mobile)                             │ │
│  │  - Active Directory Strategy (Admin)                     │ │
│  │  - Guards & Middlewares                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Modules Métier                         │ │
│  │                                                           │ │
│  │  • Auth Module          • Checklist Module               │ │
│  │  • User Module          • Assignment Module              │ │
│  │  • Dashboard Module     • Approval Module                │ │
│  │  • KPI Module           • Data Collection Module         │ │
│  │  • Report Module        • Sync Module                    │ │
│  │  • Notification Module  • File Module                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Services Transversaux                        │ │
│  │  - Logging          - Caching (Redis)                    │ │
│  │  - Validation       - Queue (Bull)                       │ │
│  │  - Error Handling   - Storage (S3/Local)                 │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │
┌─────────────────────────┴───────────────────────────────────────┐
│                    COUCHE DE DONNÉES                             │
├──────────────────────────┬──────────────────────────────────────┤
│   Base de Données        │   Services Externes                  │
│   PostgreSQL             │                                      │
│                          │   - Active Directory (LDAP)          │
│   - Données métier       │   - Serveur de fichiers             │
│   - Utilisateurs         │   - Service d'emailing               │
│   - Checklists           │   - Service SMS (optionnel)          │
│   - Collectes            │                                      │
│   - KPI                  │                                      │
│                          │                                      │
│   Redis                  │                                      │
│   - Cache                │                                      │
│   - Sessions             │                                      │
│   - Queues               │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

## Principes Architecturaux

### 1. Architecture en Couches
- **Présentation** : Applications clientes (Admin, Web, Mobile)
- **API** : Couche métier avec NestJS
- **Données** : PostgreSQL + Redis + Services externes

### 2. Séparation des Responsabilités
- Chaque module NestJS gère un domaine métier spécifique
- Les services transversaux sont réutilisables
- Isolation entre l'admin (AD) et les utilisateurs terrain (JWT)

### 3. Scalabilité
- Architecture modulaire permettant l'ajout de nouveaux modules
- Utilisation de Redis pour le cache et les queues
- API REST stateless pour faciliter la scalabilité horizontale

### 4. Sécurité
- Authentification différenciée (AD pour admin, JWT pour terrain)
- HTTPS obligatoire pour toutes les communications
- Validation des données à tous les niveaux
- RBAC (Role-Based Access Control)

### 5. Mode Hors-ligne
- Applications Web et Mobile avec capacité offline
- Synchronisation automatique lors de la reconnexion
- Gestion des conflits de données

## Stack Technologique

### Backend
- **Framework** : NestJS (TypeScript)
- **Base de données** : PostgreSQL
- **Cache** : Redis
- **ORM** : TypeORM ou Prisma
- **Authentification** : 
  - Passport.js (JWT Strategy + LDAP Strategy)
  - @nestjs/jwt
  - passport-ldapauth
- **Validation** : class-validator, class-transformer
- **Documentation API** : Swagger/OpenAPI
- **Tests** : Jest

### Frontend Admin
- **Framework** : React.js (TypeScript)
- **State Management** : Redux Toolkit ou Zustand
- **UI Library** : Material-UI ou Ant Design
- **Charts** : Recharts ou Chart.js
- **HTTP Client** : Axios
- **Routing** : React Router
- **Forms** : React Hook Form + Zod

### Frontend Web (Terrain)
- **Framework** : React.js (TypeScript)
- **Offline** : Workbox (PWA) ou LocalForage
- **State Management** : Redux Toolkit avec Redux-Persist
- **UI Library** : Material-UI ou Chakra UI
- **Forms** : React Hook Form + Zod
- **Sync** : Custom sync service

### Mobile
- **Framework** : Flutter
- **State Management** : Bloc ou Riverpod
- **Storage Local** : Sqflite + Hive
- **HTTP Client** : Dio
- **Offline** : Custom sync strategy

## Flux de Données

### Mode Online
1. L'utilisateur effectue une action dans l'application
2. Requête HTTP vers l'API NestJS
3. Authentification et autorisation
4. Traitement métier
5. Interaction avec la base de données
6. Réponse à l'utilisateur

### Mode Offline (Web/Mobile)
1. L'utilisateur effectue une action
2. Stockage local des données
3. Mise en queue de la synchronisation
4. Détection de la connexion
5. Synchronisation automatique
6. Résolution des conflits si nécessaire

## Sécurité et Conformité

### Authentification
- **Admin** : Active Directory (Single Sign-On)
- **Terrain** : JWT avec refresh tokens
- Sessions sécurisées avec expiration

### Autorisation
- RBAC avec rôles : Admin, Supervisor, Operator, Viewer
- Permissions granulaires par module
- Isolation des données par département/zone

### Protection des Données
- Chiffrement en transit (HTTPS/TLS)
- Chiffrement au repos pour données sensibles
- Audit trail complet des actions
- Backup automatique

## Performance

### Optimisations Backend
- Cache Redis pour les requêtes fréquentes
- Pagination des résultats
- Lazy loading des relations
- Indexation optimale des tables
- Queue system pour traitements asynchrones

### Optimisations Frontend
- Code splitting
- Lazy loading des composants
- Memoization
- Virtualisation des listes longues
- Optimistic UI updates

## Monitoring et Logging

### Logging
- Logs structurés (Winston ou Pino)
- Niveaux : ERROR, WARN, INFO, DEBUG
- Rotation des logs
- Centralisation optionnelle (ELK Stack)

### Monitoring
- Health checks
- Métriques de performance
- Alertes sur erreurs critiques
- Dashboard de monitoring (optionnel : Grafana)

## Déploiement

### Environnements
- **Développement** : Local
- **Test/Staging** : Serveur de test
- **Production** : Serveur de production

### Stratégie de Déploiement
- CI/CD avec GitLab CI ou GitHub Actions
- Tests automatisés avant déploiement
- Blue-Green deployment ou Rolling updates
- Rollback automatique en cas d'erreur

### Infrastructure
- **Backend** : Docker + Docker Compose
- **Base de données** : PostgreSQL avec réplication
- **Cache** : Redis cluster
- **Reverse Proxy** : Nginx
- **Certificats SSL** : Let's Encrypt ou certificat d'entreprise
