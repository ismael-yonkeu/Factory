# Diagramme de Séquence - Authentification JWT (Web Terrain & Mobile)

## Vue d'ensemble
L'authentification JWT est utilisée pour les applications Web Terrain et Mobile. Elle permet une authentification stateless avec des tokens portables et une gestion flexible des sessions.

## Diagramme de séquence - Connexion initiale

```mermaid
sequenceDiagram
    autonumber
    
    participant User as Opérateur
    participant Client as Client (Web/Mobile)
    participant API as API NestJS
    participant AuthService as Service Auth
    participant Validator as Validator Service
    participant Cache as Redis
    participant DB as PostgreSQL
    participant SMS as Service SMS
    participant Email as Service Email

    Note over User,Email: Authentification avec email/téléphone + mot de passe
    
    User->>Client: Accès application
    Client->>Client: Vérifier tokens locaux
    
    alt Pas de token valide
        Client->>User: Afficher écran login
        User->>Client: Saisie email/téléphone + password
        
        Client->>Client: Validation format
        Client->>API: POST /api/auth/jwt/login
        Note right of Client: {<br/>  "identifier": "email@example.com",<br/>  "password": "******",<br/>  "deviceId": "uuid",<br/>  "platform": "web/ios/android"<br/>}
        
        API->>Validator: Validate Request DTO
        Validator-->>API: Validation OK
        
        API->>AuthService: authenticateUser()
        
        AuthService->>DB: Find User by Email/Phone
        DB-->>AuthService: User Record
        
        alt User existe
            AuthService->>AuthService: Verify Password (bcrypt)
            
            alt Password correct
                AuthService->>DB: Check Account Status
                DB-->>AuthService: Account Active
                
                AuthService->>DB: Log Login Attempt
                DB-->>AuthService: OK
                
                AuthService->>AuthService: Generate Access Token
                Note right of AuthService: Durée: 15 minutes
                AuthService->>AuthService: Generate Refresh Token
                Note right of AuthService: Durée: 7 jours
                
                AuthService->>Cache: Store Refresh Token
                Note right of AuthService: Key: user:{userId}:refresh:{deviceId}
                
                AuthService->>DB: Update Last Login
                DB-->>AuthService: OK
                
                AuthService-->>API: Tokens + User Info
                API-->>Client: 200 OK
                Note left of API: {<br/>  "accessToken": "eyJ...",<br/>  "refreshToken": "eyJ...",<br/>  "user": {...},<br/>  "expiresIn": 900<br/>}
                
                Client->>Client: Store Tokens Securely
                Note right of Client: Web: httpOnly cookies<br/>Mobile: Secure Storage
                
                Client->>User: Redirect to Dashboard
                
            else Password incorrect
                AuthService->>DB: Log Failed Attempt
                DB-->>AuthService: Attempt Count
                
                alt Attempts >= 5
                    AuthService->>DB: Lock Account (30 min)
                    AuthService->>Email: Send Security Alert
                    AuthService-->>API: Account Locked
                    API-->>Client: 423 Locked
                    Client->>User: Compte verrouillé (30 min)
                else Attempts < 5
                    AuthService-->>API: Invalid Credentials
                    API-->>Client: 401 Unauthorized
                    Client->>User: Email/Mot de passe incorrect
                end
            end
            
        else User n'existe pas
            AuthService->>AuthService: Fake Hash Comparison
            Note right of AuthService: Prevent timing attacks
            AuthService-->>API: Invalid Credentials
            API-->>Client: 401 Unauthorized
            Client->>User: Email/Mot de passe incorrect
        end
    end
```

## Diagramme de séquence - Authentification à deux facteurs (2FA)

```mermaid
sequenceDiagram
    autonumber
    
    participant User as Opérateur
    participant Client as Client (Web/Mobile)
    participant API as API NestJS
    participant AuthService as Service Auth
    participant Cache as Redis
    participant SMS as Service SMS
    participant Email as Service Email

    Note over User,Email: Si 2FA activé pour l'utilisateur
    
    Client->>API: POST /api/auth/jwt/login
    API->>AuthService: authenticateUser()
    AuthService->>AuthService: Validate Credentials
    
    alt 2FA activé
        AuthService->>AuthService: Generate OTP Code
        Note right of AuthService: 6 digits, valid 5 min
        
        AuthService->>Cache: Store OTP
        Cache-->>AuthService: OK
        
        alt Préférence SMS
            AuthService->>SMS: Send OTP
            SMS-->>User: SMS avec code
        else Préférence Email
            AuthService->>Email: Send OTP
            Email-->>User: Email avec code
        end
        
        AuthService-->>API: 2FA Required
        API-->>Client: 202 Accepted
        Note left of API: {<br/>  "requires2FA": true,<br/>  "tempToken": "temp...",<br/>  "method": "sms/email"<br/>}
        
        Client->>User: Demander code OTP
        User->>Client: Saisie code OTP
        
        Client->>API: POST /api/auth/jwt/verify-otp
        Note right of Client: {<br/>  "tempToken": "temp...",<br/>  "otp": "123456"<br/>}
        
        API->>AuthService: verifyOTP()
        AuthService->>Cache: Get Stored OTP
        Cache-->>AuthService: OTP Value
        
        alt OTP correct et valide
            AuthService->>AuthService: Generate Tokens
            AuthService->>Cache: Invalidate OTP
            AuthService-->>API: Auth Success
            API-->>Client: 200 OK + Tokens
            Client->>User: Accès accordé
        else OTP incorrect ou expiré
            AuthService-->>API: Invalid OTP
            API-->>Client: 401 Unauthorized
            Client->>User: Code incorrect
        end
    end
```

## Diagramme de séquence - Rafraîchissement du token

```mermaid
sequenceDiagram
    autonumber
    
    participant Client as Client (Web/Mobile)
    participant Interceptor as HTTP Interceptor
    participant API as API NestJS
    participant AuthService as Service Auth
    participant Cache as Redis
    participant DB as PostgreSQL

    Note over Client,DB: Rafraîchissement automatique du token d'accès
    
    Client->>Interceptor: API Request
    Interceptor->>Interceptor: Check Access Token
    
    alt Token expiré ou proche expiration
        Interceptor->>API: POST /api/auth/jwt/refresh
        Note right of Interceptor: {<br/>  "refreshToken": "eyJ...",<br/>  "deviceId": "uuid"<br/>}
        
        API->>AuthService: refreshTokens()
        AuthService->>AuthService: Verify Refresh Token
        
        alt Refresh Token valide
            AuthService->>Cache: Check Token in Redis
            Cache-->>AuthService: Token Found
            
            AuthService->>DB: Get User Status
            DB-->>AuthService: User Active
            
            AuthService->>AuthService: Generate New Access Token
            AuthService->>AuthService: Rotate Refresh Token
            Note right of AuthService: Optional: Rotation pour sécurité
            
            AuthService->>Cache: Update Refresh Token
            Cache-->>AuthService: OK
            
            AuthService-->>API: New Tokens
            API-->>Interceptor: 200 OK
            Note left of API: {<br/>  "accessToken": "new...",<br/>  "refreshToken": "new...",<br/>  "expiresIn": 900<br/>}
            
            Interceptor->>Interceptor: Update Stored Tokens
            Interceptor->>API: Retry Original Request
            API-->>Interceptor: Response
            Interceptor-->>Client: Response
            
        else Refresh Token invalide
            AuthService->>Cache: Delete All User Sessions
            AuthService-->>API: Invalid Token
            API-->>Interceptor: 401 Unauthorized
            Interceptor->>Client: Force Logout
            Client->>Client: Clear Storage
            Client->>Client: Redirect to Login
        end
        
    else Token valide
        Interceptor->>API: Original Request
        API-->>Interceptor: Response
        Interceptor-->>Client: Response
    end
```

## Diagramme de séquence - Réinitialisation du mot de passe

```mermaid
sequenceDiagram
    autonumber
    
    participant User as Opérateur
    participant Client as Client (Web/Mobile)
    participant API as API NestJS
    participant AuthService as Service Auth
    participant Cache as Redis
    participant DB as PostgreSQL
    participant Email as Service Email

    Note over User,Email: Flux de réinitialisation du mot de passe
    
    User->>Client: Click "Mot de passe oublié"
    Client->>User: Formulaire email/téléphone
    User->>Client: Saisie email/téléphone
    
    Client->>API: POST /api/auth/jwt/forgot-password
    Note right of Client: {<br/>  "identifier": "email@example.com"<br/>}
    
    API->>AuthService: initPasswordReset()
    AuthService->>DB: Find User
    
    alt User existe
        DB-->>AuthService: User Record
        
        AuthService->>AuthService: Generate Reset Token
        Note right of AuthService: UUID, valid 1 heure
        
        AuthService->>Cache: Store Reset Token
        Cache-->>AuthService: OK
        
        AuthService->>Email: Send Reset Email
        Note right of AuthService: Lien: app://reset?token=uuid
        
        AuthService->>DB: Log Password Reset Request
        DB-->>AuthService: OK
        
        AuthService-->>API: Success
    else User n'existe pas
        AuthService->>AuthService: Fake Delay
        Note right of AuthService: Prevent user enumeration
        AuthService-->>API: Success (fake)
    end
    
    API-->>Client: 200 OK
    Client->>User: Email envoyé (si compte existe)
    
    Note over User,Email: Utilisateur clique sur le lien
    
    User->>Client: Open Reset Link
    Client->>API: GET /api/auth/jwt/verify-reset-token
    Note right of Client: {<br/>  "token": "uuid"<br/>}
    
    API->>AuthService: verifyResetToken()
    AuthService->>Cache: Check Token
    
    alt Token valide
        Cache-->>AuthService: Token Data
        AuthService-->>API: Token Valid
        API-->>Client: 200 OK
        
        Client->>User: Formulaire nouveau mot de passe
        User->>Client: Saisie nouveau mot de passe
        
        Client->>Client: Validate Password Strength
        Client->>API: POST /api/auth/jwt/reset-password
        Note right of Client: {<br/>  "token": "uuid",<br/>  "password": "newPassword",<br/>  "confirmPassword": "newPassword"<br/>}
        
        API->>AuthService: resetPassword()
        AuthService->>Cache: Verify Token Again
        Cache-->>AuthService: Valid
        
        AuthService->>AuthService: Hash New Password
        AuthService->>DB: Update Password
        DB-->>AuthService: OK
        
        AuthService->>Cache: Invalidate All Sessions
        AuthService->>Cache: Delete Reset Token
        AuthService->>Email: Send Confirmation
        
        AuthService-->>API: Success
        API-->>Client: 200 OK
        Client->>User: Mot de passe changé
        Client->>Client: Redirect to Login
        
    else Token invalide ou expiré
        Cache-->>AuthService: Token Not Found
        AuthService-->>API: Invalid Token
        API-->>Client: 400 Bad Request
        Client->>User: Lien invalide ou expiré
    end
```

## Diagramme de séquence - Déconnexion et révocation

```mermaid
sequenceDiagram
    autonumber
    
    participant User as Opérateur
    participant Client as Client (Web/Mobile)
    participant API as API NestJS
    participant AuthService as Service Auth
    participant Cache as Redis
    participant DB as PostgreSQL

    Note over User,DB: Déconnexion simple
    
    User->>Client: Click Logout
    Client->>API: POST /api/auth/jwt/logout
    Note right of Client: Headers:<br/>Authorization: Bearer [accessToken]<br/>Body: {<br/>  "refreshToken": "eyJ...",<br/>  "deviceId": "uuid"<br/>}
    
    API->>AuthService: logout()
    
    AuthService->>Cache: Add Access Token to Blacklist
    Note right of AuthService: TTL = remaining token time
    
    AuthService->>Cache: Delete Refresh Token
    Cache-->>AuthService: OK
    
    AuthService->>DB: Log Logout Event
    DB-->>AuthService: OK
    
    AuthService-->>API: Success
    API-->>Client: 200 OK
    
    Client->>Client: Clear Local Storage
    Client->>Client: Clear Secure Storage
    Client->>Client: Clear Memory
    Client->>Client: Redirect to Login
    Client->>User: Déconnecté
    
    Note over User,DB: Déconnexion de tous les appareils
    
    User->>Client: "Déconnecter tous les appareils"
    Client->>API: POST /api/auth/jwt/logout-all
    
    API->>AuthService: logoutAllDevices()
    
    AuthService->>Cache: Get All User Sessions
    Cache-->>AuthService: Session List
    
    AuthService->>Cache: Delete All Refresh Tokens
    AuthService->>Cache: Add All Access Tokens to Blacklist
    
    AuthService->>DB: Log Security Event
    DB-->>AuthService: OK
    
    AuthService-->>API: Success
    API-->>Client: 200 OK
    Client->>User: Tous les appareils déconnectés
```

## Configuration et structure des tokens

### Structure du JWT Access Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "550e8400-e29b-41d4-a716-446655440000",
    "email": "operator@example.com",
    "phone": "+33612345678",
    "name": "Jean Dupont",
    "roles": ["OPERATOR", "SUPERVISOR"],
    "permissions": [
      "checklist.fill",
      "checklist.view",
      "data.collect",
      "report.view"
    ],
    "deviceId": "device-uuid",
    "platform": "web|ios|android",
    "iat": 1698765432,
    "exp": 1698766332,
    "iss": "factory-platform",
    "aud": "field-apps",
    "jti": "unique-token-id"
  },
  "signature": "..."
}
```

### Structure du JWT Refresh Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "550e8400-e29b-41d4-a716-446655440000",
    "tokenFamily": "family-uuid",
    "deviceId": "device-uuid",
    "platform": "web|ios|android",
    "iat": 1698765432,
    "exp": 1699370232,
    "iss": "factory-platform",
    "jti": "refresh-token-id"
  },
  "signature": "..."
}
```

### Configuration de sécurité

```typescript
interface JWTConfig {
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m',
    algorithm: 'HS256',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256',
    rotation: true, // Rotation automatique
  },
  security: {
    maxDevicesPerUser: 5,
    requireDeviceId: true,
    blacklistTTL: 86400, // 24h
    sessionTimeout: 28800, // 8h d'inactivité
  },
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5, // 5 derniers mots de passe
    maxAge: 90, // Jours
  },
  otp: {
    length: 6,
    ttl: 300, // 5 minutes
    maxAttempts: 3,
    algorithm: 'SHA1',
  },
  rateLimit: {
    login: {
      points: 5,
      duration: 60, // 5 tentatives par minute
    },
    refresh: {
      points: 10,
      duration: 60, // 10 refresh par minute
    },
    passwordReset: {
      points: 3,
      duration: 3600, // 3 par heure
    },
  },
}
```

## Gestion des erreurs

### Codes d'erreur et réponses

| Code | Erreur | Description | Action Client |
|------|--------|-------------|---------------|
| 400 | Bad Request | Données invalides | Vérifier les champs |
| 401 | Unauthorized | Token invalide/expiré | Refresh ou re-login |
| 403 | Forbidden | Permissions insuffisantes | Message d'erreur |
| 423 | Locked | Compte verrouillé | Attendre ou contacter admin |
| 429 | Too Many Requests | Rate limit atteint | Attendre et réessayer |
| 440 | Login Timeout | Session expirée | Re-authentication requise |

### Format des erreurs

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "details": {
    "code": "AUTH_001",
    "field": "password",
    "attempts": 2,
    "maxAttempts": 5
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Sécurité et bonnes pratiques

### Mesures de sécurité implémentées

1. **Stockage sécurisé des tokens**
   - Web: httpOnly cookies + Secure flag
   - Mobile: Keychain (iOS) / Keystore (Android)
   - Pas de stockage en localStorage (XSS)

2. **Protection contre les attaques**
   - CSRF tokens pour les formulaires
   - Rate limiting sur tous les endpoints
   - Captcha après échecs multiples
   - Détection d'anomalies (géolocalisation)

3. **Chiffrement et hashing**
   - Bcrypt pour les mots de passe (cost: 12)
   - HTTPS obligatoire (TLS 1.3)
   - Secrets rotation régulière

4. **Validation et sanitization**
   - Validation stricte des inputs
   - Échappement des caractères spéciaux
   - Limitation de la taille des requêtes

5. **Monitoring et audit**
   - Logs de toutes les opérations sensibles
   - Alertes temps réel sur comportements suspects
   - Audit trail complet avec timestamp et IP

### Compliance

- **OWASP** Authentication Cheat Sheet
- **RFC 7519** JWT Standard
- **RFC 6749** OAuth 2.0
- **GDPR** pour les données personnelles