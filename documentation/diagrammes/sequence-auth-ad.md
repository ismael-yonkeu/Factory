# Diagramme de Séquence - Authentification Active Directory (Admin)

## Vue d'ensemble
L'authentification via Active Directory est utilisée exclusivement pour l'interface d'administration. Elle permet une intégration avec l'infrastructure d'entreprise existante et une gestion centralisée des accès.

## Diagramme de séquence principal

```mermaid
sequenceDiagram
    autonumber
    
    participant Admin as Administrateur
    participant Browser as Navigateur
    participant ReactApp as React Admin
    participant API as API NestJS
    participant AuthService as Service Auth
    participant Cache as Redis Cache
    participant AD as Active Directory
    participant DB as PostgreSQL

    Note over Admin,DB: Flux d'authentification initial
    
    Admin->>Browser: Accès à l'application admin
    Browser->>ReactApp: GET /admin
    ReactApp->>ReactApp: Vérification token local
    
    alt Token absent ou expiré
        ReactApp->>Browser: Redirection page login
        Browser->>Admin: Affichage formulaire
        Admin->>Browser: Saisie domaine\username + password
        Browser->>ReactApp: Submit credentials
        
        ReactApp->>API: POST /api/auth/ad/login
        Note right of ReactApp: {<br/>  "username": "domaine\\user",<br/>  "password": "******"<br/>}
        
        API->>AuthService: validateADCredentials()
        AuthService->>Cache: Vérifier si user en cache
        
        alt User pas en cache
            Cache-->>AuthService: null
            AuthService->>AD: LDAP Bind
            Note right of AuthService: ldaps://ad.company.com:636
            
            AD->>AD: Validation credentials
            
            alt Credentials valides
                AD-->>AuthService: Bind Success + User Info
                AuthService->>AD: Search User Attributes
                AD-->>AuthService: User Details (groups, email, etc.)
                
                AuthService->>DB: Upsert User Info
                DB-->>AuthService: User Record
                
                AuthService->>DB: Get User Permissions
                DB-->>AuthService: Roles & Permissions
                
                AuthService->>Cache: Store User Session
                Note right of AuthService: TTL: 8 heures
                
                AuthService->>AuthService: Generate JWT Token
                Note right of AuthService: Claims: userId, roles, permissions
                
                AuthService-->>API: Auth Success + User Data
                API-->>ReactApp: 200 OK + Token + User Info
                
                ReactApp->>ReactApp: Store Token (localStorage)
                ReactApp->>Browser: Redirect to Dashboard
                Browser->>Admin: Affichage Dashboard
                
            else Credentials invalides
                AD-->>AuthService: Bind Failed
                AuthService->>AuthService: Log Failed Attempt
                AuthService-->>API: Auth Failed
                API-->>ReactApp: 401 Unauthorized
                ReactApp->>Browser: Erreur authentification
                Browser->>Admin: Message d'erreur
            end
            
        else User en cache
            Cache-->>AuthService: Cached User Data
            AuthService->>AD: Quick Bind Validation
            AD-->>AuthService: Validation Result
            
            alt Validation OK
                AuthService->>AuthService: Generate JWT Token
                AuthService-->>API: Auth Success + Cached Data
                API-->>ReactApp: 200 OK + Token
                ReactApp->>Browser: Redirect to Dashboard
            else Validation Failed
                AuthService->>Cache: Invalidate Cache
                AuthService-->>API: Auth Failed
                API-->>ReactApp: 401 Unauthorized
            end
        end
        
    else Token valide
        ReactApp->>API: GET /api/auth/verify
        API->>AuthService: verifyToken()
        AuthService->>Cache: Check Token Blacklist
        
        alt Token valide et non blacklisté
            AuthService-->>API: Token Valid
            API-->>ReactApp: 200 OK
            ReactApp->>Browser: Continue to requested page
        else Token invalide ou blacklisté
            AuthService-->>API: Token Invalid
            API-->>ReactApp: 401 Unauthorized
            ReactApp->>Browser: Redirect to login
        end
    end
```

## Flux de rafraîchissement du token

```mermaid
sequenceDiagram
    autonumber
    
    participant ReactApp as React Admin
    participant API as API NestJS
    participant AuthService as Service Auth
    participant Cache as Redis
    participant AD as Active Directory

    Note over ReactApp,AD: Rafraîchissement automatique du token
    
    ReactApp->>ReactApp: Token proche expiration
    ReactApp->>API: POST /api/auth/ad/refresh
    Note right of ReactApp: Header: Authorization: Bearer [token]
    
    API->>AuthService: refreshToken()
    AuthService->>AuthService: Validate Current Token
    
    alt Token valide
        AuthService->>Cache: Get User Session
        Cache-->>AuthService: Session Data
        
        AuthService->>AD: Validate User Still Active
        AD-->>AuthService: User Status
        
        alt User toujours actif
            AuthService->>AuthService: Generate New Token
            AuthService->>Cache: Update Session
            AuthService-->>API: New Token
            API-->>ReactApp: 200 OK + New Token
            ReactApp->>ReactApp: Update Stored Token
        else User désactivé
            AuthService->>Cache: Invalidate Session
            AuthService-->>API: User Inactive
            API-->>ReactApp: 403 Forbidden
            ReactApp->>ReactApp: Logout User
        end
    else Token invalide
        AuthService-->>API: Invalid Token
        API-->>ReactApp: 401 Unauthorized
        ReactApp->>ReactApp: Redirect to Login
    end
```

## Flux de déconnexion

```mermaid
sequenceDiagram
    autonumber
    
    participant Admin as Administrateur
    participant ReactApp as React Admin
    participant API as API NestJS
    participant AuthService as Service Auth
    participant Cache as Redis

    Admin->>ReactApp: Click Logout
    ReactApp->>API: POST /api/auth/logout
    Note right of ReactApp: Header: Authorization: Bearer [token]
    
    API->>AuthService: logout()
    AuthService->>Cache: Add Token to Blacklist
    Note right of AuthService: TTL = Token remaining time
    AuthService->>Cache: Delete User Session
    Cache-->>AuthService: OK
    
    AuthService-->>API: Logout Success
    API-->>ReactApp: 200 OK
    
    ReactApp->>ReactApp: Clear Local Storage
    ReactApp->>ReactApp: Clear Session Storage
    ReactApp->>ReactApp: Redirect to Login
    ReactApp->>Admin: Affichage page login
```

## Gestion des erreurs et cas particuliers

```mermaid
sequenceDiagram
    autonumber
    
    participant ReactApp as React Admin
    participant API as API NestJS
    participant AuthService as Service Auth
    participant AD as Active Directory
    participant AlertSystem as Système d'Alertes

    Note over ReactApp,AlertSystem: Gestion des cas d'erreur
    
    alt Compte verrouillé (3 tentatives échouées)
        ReactApp->>API: POST /api/auth/ad/login
        API->>AuthService: validateADCredentials()
        AuthService->>AD: LDAP Bind
        AD-->>AuthService: Account Locked
        AuthService->>AlertSystem: Send Security Alert
        AuthService-->>API: Account Locked Error
        API-->>ReactApp: 423 Locked
        ReactApp->>ReactApp: Show "Contact Administrator"
    
    else Mot de passe expiré
        AD-->>AuthService: Password Expired
        AuthService-->>API: Password Expired
        API-->>ReactApp: 403 + Password Reset Required
        ReactApp->>ReactApp: Redirect to Password Reset
    
    else Serveur AD indisponible
        AuthService-xAD: Connection Failed
        AuthService->>AuthService: Try Fallback AD Server
        
        alt Fallback réussi
            AuthService->>AD: Connect to Backup AD
            Note over AuthService,AD: Continue normal flow
        else Tous les serveurs down
            AuthService->>AlertSystem: Critical Alert - AD Down
            AuthService-->>API: Service Unavailable
            API-->>ReactApp: 503 Service Unavailable
            ReactApp->>ReactApp: Show Maintenance Message
        end
    
    else Session expirée côté AD
        AD-->>AuthService: Session Expired
        AuthService->>AuthService: Clear Cache
        AuthService-->>API: Session Expired
        API-->>ReactApp: 440 Session Expired
        ReactApp->>ReactApp: Force Re-login
    end
```

## Configuration et paramètres

### Configuration LDAP

```typescript
// Configuration pour la connexion Active Directory
interface ADConfig {
  // Serveur principal
  primary: {
    url: 'ldaps://ad.company.com:636',
    baseDN: 'DC=company,DC=com',
    username: 'CN=ServiceAccount,CN=Users,DC=company,DC=com',
    password: process.env.AD_SERVICE_PASSWORD,
  },
  
  // Serveur de backup
  secondary: {
    url: 'ldaps://ad2.company.com:636',
    baseDN: 'DC=company,DC=com',
    username: 'CN=ServiceAccount,CN=Users,DC=company,DC=com',
    password: process.env.AD_SERVICE_PASSWORD,
  },
  
  // Options de connexion
  options: {
    tlsOptions: {
      rejectUnauthorized: true,
      ca: [fs.readFileSync('./certs/ca.pem')],
    },
    timeout: 5000,
    connectTimeout: 10000,
    idleTimeout: 180000,
  },
  
  // Mapping des attributs
  attributes: {
    user: ['sAMAccountName', 'mail', 'displayName', 'memberOf', 'department'],
    group: ['cn', 'member', 'description'],
  },
  
  // Filtres de recherche
  filters: {
    user: '(&(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))',
    group: '(objectClass=group)',
  },
}
```

### Structure du Token JWT

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "domaine\\username",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@company.com",
    "name": "John Doe",
    "roles": ["ADMIN", "SUPERVISOR"],
    "permissions": [
      "dashboard.view",
      "checklist.create",
      "checklist.approve",
      "user.manage"
    ],
    "department": "Production",
    "iat": 1698765432,
    "exp": 1698794232,
    "iss": "factory-platform",
    "aud": "admin-interface"
  },
  "signature": "..."
}
```

### Codes d'erreur spécifiques

| Code | Description | Action côté client |
|------|-------------|-------------------|
| 401 | Credentials invalides | Afficher erreur de connexion |
| 403 | Compte désactivé ou sans permissions | Message "Contactez l'administrateur" |
| 423 | Compte verrouillé | Message avec délai de déblocage |
| 440 | Session AD expirée | Forcer reconnexion |
| 503 | Service AD indisponible | Message de maintenance |

## Sécurité et bonnes pratiques

### Mesures de sécurité implémentées

1. **Connexion sécurisée**
   - LDAPS (LDAP over SSL) sur port 636
   - Validation du certificat SSL
   - Aucun mot de passe en clair

2. **Protection contre les attaques**
   - Rate limiting: max 5 tentatives par minute
   - Account lockout après 3 échecs
   - Captcha après 2 échecs
   - Détection des patterns d'attaque

3. **Gestion des sessions**
   - Token avec durée de vie limitée (8h)
   - Blacklist des tokens révoqués
   - Rotation automatique des tokens
   - Session binding avec IP

4. **Audit et monitoring**
   - Log de toutes les tentatives de connexion
   - Alertes sur comportements suspects
   - Audit trail complet
   - Métriques de performance

### Compliance et standards

- **OWASP Top 10** compliance
- **ISO 27001** alignement
- **GDPR** pour les données personnelles
- **PCI DSS** si traitement de données sensibles