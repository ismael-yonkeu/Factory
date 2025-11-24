# Systèmes d'Authentification

Ce document décrit les deux systèmes d'authentification utilisés dans la plateforme :
1. **Active Directory (AD)** pour les administrateurs
2. **JWT** pour les utilisateurs terrain (Web et Mobile)

---

## 1. Authentification Active Directory (Admin)

### Vue d'ensemble
L'authentification AD permet aux administrateurs de se connecter avec leurs identifiants d'entreprise via le protocole LDAP. Cela offre une expérience Single Sign-On (SSO) et centralise la gestion des utilisateurs.

### Diagramme de Séquence - Authentification AD

```
┌─────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Admin   │         │ Admin    │         │   API    │         │ Active   │
│ Browser │         │ React App│         │  NestJS  │         │Directory │
└────┬────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                   │                    │                    │
     │  1. Accès à       │                    │                    │
     │  l'application    │                    │                    │
     ├──────────────────>│                    │                    │
     │                   │                    │                    │
     │  2. Formulaire    │                    │                    │
     │  de connexion AD  │                    │                    │
     │<──────────────────┤                    │                    │
     │                   │                    │                    │
     │  3. Saisie        │                    │                    │
     │  username +       │                    │                    │
     │  password         │                    │                    │
     ├──────────────────>│                    │                    │
     │                   │                    │                    │
     │                   │  4. POST /auth/ad/login                 │
     │                   │    {username, password}                 │
     │                   ├───────────────────>│                    │
     │                   │                    │                    │
     │                   │                    │  5. Validation     │
     │                   │                    │  credentials       │
     │                   │                    │  via LDAP          │
     │                   │                    ├───────────────────>│
     │                   │                    │                    │
     │                   │                    │  6. Bind AD        │
     │                   │                    │  avec credentials  │
     │                   │                    │                    ├──┐
     │                   │                    │                    │  │ Authentification
     │                   │                    │                    │<─┘ LDAP
     │                   │                    │                    │
     │                   │                    │  7. Success +      │
     │                   │                    │  User Info         │
     │                   │                    │<───────────────────┤
     │                   │                    │                    │
     │                   │                    ├──┐                 │
     │                   │                    │  │ 8. Recherche    │
     │                   │                    │  │ ou création     │
     │                   │                    │  │ user en DB      │
     │                   │                    │<─┘                 │
     │                   │                    │                    │
     │                   │                    ├──┐                 │
     │                   │                    │  │ 9. Récupération │
     │                   │                    │  │ roles et        │
     │                   │                    │  │ permissions     │
     │                   │                    │<─┘                 │
     │                   │                    │                    │
     │                   │                    ├──┐                 │
     │                   │                    │  │ 10. Génération  │
     │                   │                    │  │ JWT Access +    │
     │                   │                    │  │ Refresh Token   │
     │                   │                    │<─┘                 │
     │                   │                    │                    │
     │                   │                    ├──┐                 │
     │                   │                    │  │ 11. Sauvegarde  │
     │                   │                    │  │ refresh token   │
     │                   │                    │  │ en DB           │
     │                   │                    │<─┘                 │
     │                   │                    │                    │
     │                   │                    ├──┐                 │
     │                   │                    │  │ 12. Log audit   │
     │                   │                    │  │ (connexion)     │
     │                   │                    │<─┘                 │
     │                   │                    │                    │
     │                   │  13. Response:     │                    │
     │                   │  {                 │                    │
     │                   │    accessToken,    │                    │
     │                   │    refreshToken,   │                    │
     │                   │    user: {...},    │                    │
     │                   │    roles: [...],   │                    │
     │                   │    permissions: [...] }                 │
     │                   │<───────────────────┤                    │
     │                   │                    │                    │
     │                   ├──┐                 │                    │
     │                   │  │ 14. Stockage    │                    │
     │                   │  │ tokens dans     │                    │
     │                   │  │ localStorage    │                    │
     │                   │<─┘                 │                    │
     │                   │                    │                    │
     │  15. Redirection  │                    │                    │
     │  vers Dashboard   │                    │                    │
     │<──────────────────┤                    │                    │
     │                   │                    │                    │
     │                   │                    │                    │
     │  ════════════════ Requêtes suivantes ═════════════════════  │
     │                   │                    │                    │
     │                   │  16. GET /api/xxx  │                    │
     │                   │  Authorization:    │                    │
     │                   │  Bearer {token}    │                    │
     │                   ├───────────────────>│                    │
     │                   │                    │                    │
     │                   │                    ├──┐                 │
     │                   │                    │  │ 17. Validation  │
     │                   │                    │  │ JWT signature   │
     │                   │                    │  │ & expiration    │
     │                   │                    │<─┘                 │
     │                   │                    │                    │
     │                   │                    ├──┐                 │
     │                   │                    │  │ 18. Vérification│
     │                   │                    │  │ permissions     │
     │                   │                    │<─┘                 │
     │                   │                    │                    │
     │                   │  19. Response      │                    │
     │                   │<───────────────────┤                    │
     │                   │                    │                    │
```

### Flux Détaillé - Authentification AD

#### Phase 1 : Connexion
1. **Affichage du formulaire** : L'administrateur accède à l'application et voit le formulaire de connexion AD
2. **Saisie des identifiants** : L'admin entre son username AD (ex: `jdupont` ou `jdupont@company.local`) et son mot de passe
3. **Envoi de la requête** : Le frontend envoie `POST /auth/ad/login` avec les credentials

#### Phase 2 : Validation LDAP
4. **Réception par l'API** : Le contrôleur `AuthController` reçoit la requête
5. **Connexion LDAP** : 
   - Le service `ADAuthService` se connecte au serveur AD via LDAP
   - Configuration LDAP : `ldap://ad.company.local:389`
   - Base DN : `DC=company,DC=local`
6. **Bind LDAP** : 
   - Tentative de bind avec `CN=username,OU=Users,DC=company,DC=local`
   - Si le bind réussit, l'utilisateur est authentifié
7. **Récupération des informations** :
   - Requête LDAP pour obtenir les attributs : `cn`, `mail`, `givenName`, `sn`, `memberOf`
   - Parsing des groupes AD pour mapper vers les rôles de l'application

#### Phase 3 : Création/Mise à jour du profil
8. **Synchronisation avec la DB** :
   ```typescript
   // Recherche de l'utilisateur par username AD
   let user = await userRepository.findOne({ 
     where: { ad_username: username, auth_type: 'ad' } 
   });
   
   if (!user) {
     // Création si première connexion
     user = await userRepository.create({
       ad_username: username,
       email: adUserInfo.mail,
       first_name: adUserInfo.givenName,
       last_name: adUserInfo.sn,
       auth_type: 'ad',
       is_active: true,
       is_verified: true
     });
   } else {
     // Mise à jour des infos
     user.last_login_at = new Date();
   }
   ```

9. **Attribution des rôles** :
   ```typescript
   // Mapping groupes AD -> Rôles application
   const roleMapping = {
     'CN=AdminFactory,OU=Groups,DC=company,DC=local': 'Admin',
     'CN=Supervisors,OU=Groups,DC=company,DC=local': 'Supervisor'
   };
   
   // Synchronisation des rôles
   const roles = adGroups.map(group => roleMapping[group]).filter(Boolean);
   await userService.syncRoles(user.id, roles);
   ```

10. **Génération des tokens JWT** :
    ```typescript
    const payload = {
      sub: user.id,
      email: user.email,
      auth_type: 'ad',
      roles: user.roles,
      permissions: user.permissions
    };
    
    const accessToken = jwt.sign(payload, SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
    ```

11. **Sauvegarde du refresh token** :
    ```typescript
    await refreshTokenRepository.create({
      user_id: user.id,
      token: refreshToken,
      device_info: req.headers['user-agent'],
      ip_address: req.ip,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    ```

12. **Audit logging** :
    ```typescript
    await auditLogRepository.create({
      user_id: user.id,
      action: 'login',
      details: { auth_type: 'ad', ip: req.ip },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });
    ```

#### Phase 4 : Réponse et stockage
13. **Réponse de l'API** :
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "uuid",
        "email": "jdupont@company.local",
        "first_name": "Jean",
        "last_name": "Dupont",
        "auth_type": "ad",
        "roles": ["Admin"]
      },
      "permissions": ["checklist:create", "user:manage", ...]
    }
    ```

14. **Stockage côté client** :
    ```typescript
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    ```

15. **Redirection** : L'utilisateur est redirigé vers le dashboard

#### Phase 5 : Requêtes authentifiées
16. **Requêtes suivantes** : Chaque requête inclut l'access token dans le header
    ```
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ```

17. **Validation JWT** : Le guard `JwtAuthGuard` vérifie :
    - La signature du token
    - L'expiration
    - L'existence de l'utilisateur

18. **Vérification des permissions** : Le guard `PermissionsGuard` vérifie les permissions pour l'action demandée

### Configuration NestJS pour AD

#### Installation des dépendances
```bash
npm install passport passport-ldapauth @nestjs/passport ldapjs
npm install -D @types/passport-ldapauth @types/ldapjs
```

#### Configuration LDAP (ldap.config.ts)
```typescript
export const ldapConfig = {
  server: {
    url: process.env.LDAP_URL || 'ldap://ad.company.local:389',
    bindDN: process.env.LDAP_BIND_DN || 'CN=ServiceAccount,OU=Service,DC=company,DC=local',
    bindCredentials: process.env.LDAP_BIND_PASSWORD,
    searchBase: process.env.LDAP_SEARCH_BASE || 'DC=company,DC=local',
    searchFilter: process.env.LDAP_SEARCH_FILTER || '(sAMAccountName={{username}})',
    searchAttributes: ['cn', 'sn', 'givenName', 'mail', 'memberOf', 'department'],
    tlsOptions: {
      rejectUnauthorized: false // À activer en production avec certificats valides
    }
  },
  groupSearchBase: 'OU=Groups,DC=company,DC=local',
  groupSearchFilter: '(member={{dn}})',
  timeout: 5000,
  connectTimeout: 10000
};
```

#### Strategy LDAP (ldap.strategy.ts)
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-ldapauth';
import { ldapConfig } from './ldap.config';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor() {
    super(ldapConfig);
  }

  async validate(userLdap: any): Promise<any> {
    if (!userLdap) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return {
      username: userLdap.sAMAccountName,
      email: userLdap.mail,
      firstName: userLdap.givenName,
      lastName: userLdap.sn,
      groups: userLdap.memberOf || [],
      department: userLdap.department
    };
  }
}
```

---

## 2. Authentification JWT (Web et Mobile)

### Vue d'ensemble
L'authentification JWT est utilisée pour les utilisateurs terrain qui accèdent via l'application Web ou Mobile. Elle permet une authentification stateless et supporte le mode offline.

### Diagramme de Séquence - Authentification JWT

```
┌─────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│ User    │       │ Web/Mobile│       │   API    │       │ Database │
│         │       │    App    │       │  NestJS  │       │PostgreSQL│
└────┬────┘       └────┬─────┘       └────┬─────┘       └────┬─────┘
     │                 │                   │                  │
     │                 │                   │                  │
     │ ═══════════════ INSCRIPTION (Optionnel) ═══════════════ │
     │                 │                   │                  │
     │  1. Formulaire  │                   │                  │
     │  d'inscription  │                   │                  │
     ├────────────────>│                   │                  │
     │                 │                   │                  │
     │  2. Saisie      │                   │                  │
     │  - Email/Phone  │                   │                  │
     │  - Password     │                   │                  │
     │  - Infos perso  │                   │                  │
     ├────────────────>│                   │                  │
     │                 │                   │                  │
     │                 │  3. POST /auth/register              │
     │                 │  {email, phone, password, ...}       │
     │                 ├──────────────────>│                  │
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 4. Validation  │
     │                 │                   │ │ format email   │
     │                 │                   │ │ & phone        │
     │                 │                   │<┘                │
     │                 │                   │                  │
     │                 │                   │  5. Vérif unicité│
     │                 │                   ├─────────────────>│
     │                 │                   │                  │
     │                 │                   │  6. Check result │
     │                 │                   │<─────────────────┤
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 7. Hash        │
     │                 │                   │ │ password       │
     │                 │                   │ │ (bcrypt)       │
     │                 │                   │<┘                │
     │                 │                   │                  │
     │                 │                   │  8. INSERT user  │
     │                 │                   ├─────────────────>│
     │                 │                   │                  │
     │                 │                   │  9. User créé    │
     │                 │                   │<─────────────────┤
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 10. Attribution│
     │                 │                   │ │ rôle par défaut│
     │                 │                   │<┘ (Operator)     │
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 11. Génération │
     │                 │                   │ │ code de        │
     │                 │                   │<┘ vérification   │
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 12. Envoi      │
     │                 │                   │ │ email/SMS de   │
     │                 │                   │<┘ vérification   │
     │                 │                   │                  │
     │                 │  13. Success      │                  │
     │                 │  {message: "..."}  │                  │
     │                 │<──────────────────┤                  │
     │                 │                   │                  │
     │  14. Message    │                   │                  │
     │  "Vérifiez      │                   │                  │
     │   votre email"  │                   │                  │
     │<────────────────┤                   │                  │
     │                 │                   │                  │
     │                 │                   │                  │
     │ ═══════════════════ CONNEXION ══════════════════════════ │
     │                 │                   │                  │
     │  15. Formulaire │                   │                  │
     │  de connexion   │                   │                  │
     ├────────────────>│                   │                  │
     │                 │                   │                  │
     │  16. Saisie     │                   │                  │
     │  Email/Phone +  │                   │                  │
     │  Password       │                   │                  │
     ├────────────────>│                   │                  │
     │                 │                   │                  │
     │                 │  17. POST /auth/login                │
     │                 │  {identifier, password}              │
     │                 ├──────────────────>│                  │
     │                 │                   │                  │
     │                 │                   │  18. SELECT user │
     │                 │                   │  WHERE email OR  │
     │                 │                   │  phone = ...     │
     │                 │                   ├─────────────────>│
     │                 │                   │                  │
     │                 │                   │  19. User data   │
     │                 │                   │<─────────────────┤
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 20. Vérif      │
     │                 │                   │ │ password hash  │
     │                 │                   │ │ bcrypt.compare │
     │                 │                   │<┘                │
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 21. Vérif      │
     │                 │                   │ │ compte actif   │
     │                 │                   │ │ & vérifié      │
     │                 │                   │<┘                │
     │                 │                   │                  │
     │                 │                   │  22. Get roles   │
     │                 │                   │  & permissions   │
     │                 │                   ├─────────────────>│
     │                 │                   │                  │
     │                 │                   │  23. Roles data  │
     │                 │                   │<─────────────────┤
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 24. Génération │
     │                 │                   │ │ JWT Access +   │
     │                 │                   │ │ Refresh Token  │
     │                 │                   │<┘                │
     │                 │                   │                  │
     │                 │                   │  25. INSERT      │
     │                 │                   │  refresh_token   │
     │                 │                   ├─────────────────>│
     │                 │                   │                  │
     │                 │                   │  26. Audit log   │
     │                 │                   ├─────────────────>│
     │                 │                   │                  │
     │                 │  27. Response:    │                  │
     │                 │  {                │                  │
     │                 │    accessToken,   │                  │
     │                 │    refreshToken,  │                  │
     │                 │    user: {...},   │                  │
     │                 │    roles: [...]   │                  │
     │                 │  }                │                  │
     │                 │<──────────────────┤                  │
     │                 │                   │                  │
     │                 ├─┐                 │                  │
     │                 │ │ 28. Stockage    │                  │
     │                 │ │ - localStorage  │                  │
     │                 │ │ - SecureStorage │                  │
     │                 │<┘ (Mobile)        │                  │
     │                 │                   │                  │
     │  29. Accès à    │                   │                  │
     │  l'application  │                   │                  │
     │<────────────────┤                   │                  │
     │                 │                   │                  │
     │                 │                   │                  │
     │ ══════════════ REFRESH TOKEN ═══════════════════════════ │
     │                 │                   │                  │
     │                 │  30. GET /api/xxx │                  │
     │                 │  (token expiré)   │                  │
     │                 ├──────────────────>│                  │
     │                 │                   │                  │
     │                 │  31. 401          │                  │
     │                 │  Unauthorized     │                  │
     │                 │<──────────────────┤                  │
     │                 │                   │                  │
     │                 ├─┐                 │                  │
     │                 │ │ 32. Détection   │                  │
     │                 │ │ token expiré    │                  │
     │                 │<┘                 │                  │
     │                 │                   │                  │
     │                 │  33. POST /auth/refresh               │
     │                 │  {refreshToken}   │                  │
     │                 ├──────────────────>│                  │
     │                 │                   │                  │
     │                 │                   │  34. Verify token│
     │                 │                   │  & get user_id   │
     │                 │                   ├─────────────────>│
     │                 │                   │                  │
     │                 │                   │  35. Token valid │
     │                 │                   │<─────────────────┤
     │                 │                   │                  │
     │                 │                   ├─┐                │
     │                 │                   │ │ 36. Nouveau    │
     │                 │                   │ │ Access Token   │
     │                 │                   │<┘                │
     │                 │                   │                  │
     │                 │  37. New tokens   │                  │
     │                 │<──────────────────┤                  │
     │                 │                   │                  │
     │                 ├─┐                 │                  │
     │                 │ │ 38. MAJ storage │                  │
     │                 │<┘                 │                  │
     │                 │                   │                  │
     │                 │  39. Retry request│                  │
     │                 │  avec nouveau token│                  │
     │                 ├──────────────────>│                  │
     │                 │                   │                  │
     │                 │  40. Success      │                  │
     │                 │<──────────────────┤                  │
     │                 │                   │                  │
```

### Flux Détaillé - Authentification JWT

#### Phase 1 : Inscription (Optionnelle)

1-2. **Formulaire d'inscription** : L'utilisateur remplit ses informations
   - Email (requis)
   - Téléphone (optionnel mais recommandé pour SMS)
   - Mot de passe (min 8 caractères, complexité requise)
   - Prénom, Nom
   - Département

3. **Envoi de la requête** :
   ```json
   POST /auth/register
   {
     "email": "operateur@example.com",
     "phone": "+33612345678",
     "password": "SecurePass123!",
     "first_name": "Marie",
     "last_name": "Martin",
     "department_id": "uuid"
   }
   ```

4-6. **Validations** :
   ```typescript
   // Validation du format
   @IsEmail()
   email: string;
   
   @Matches(/^\+[1-9]\d{1,14}$/)
   phone: string;
   
   @MinLength(8)
   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
   password: string;
   
   // Vérification de l'unicité
   const existingUser = await userRepository.findOne({
     where: [{ email }, { phone }]
   });
   if (existingUser) {
     throw new ConflictException('User already exists');
   }
   ```

7. **Hash du mot de passe** :
   ```typescript
   import * as bcrypt from 'bcrypt';
   const saltRounds = 10;
   const password_hash = await bcrypt.hash(password, saltRounds);
   ```

8-9. **Création de l'utilisateur** :
   ```typescript
   const user = await userRepository.create({
     email,
     phone,
     password_hash,
     first_name,
     last_name,
     department_id,
     auth_type: 'jwt',
     is_active: true,
     is_verified: false
   });
   ```

10. **Attribution du rôle par défaut** :
    ```typescript
    const operatorRole = await roleRepository.findOne({ 
      where: { name: 'Operator' } 
    });
    await userRoleRepository.create({
      user_id: user.id,
      role_id: operatorRole.id
    });
    ```

11-12. **Envoi du code de vérification** :
    ```typescript
    const verificationCode = generateRandomCode(6); // 123456
    await verificationCodeRepository.create({
      user_id: user.id,
      code: verificationCode,
      type: 'email_verification',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    });
    
    await emailService.sendVerificationEmail(user.email, verificationCode);
    ```

#### Phase 2 : Connexion

15-16. **Formulaire de connexion** : L'utilisateur entre son identifiant et mot de passe

17. **Envoi de la requête** :
    ```json
    POST /auth/login
    {
      "identifier": "operateur@example.com", // ou "+33612345678"
      "password": "SecurePass123!"
    }
    ```

18-19. **Recherche de l'utilisateur** :
    ```typescript
    const user = await userRepository.findOne({
      where: [
        { email: identifier, auth_type: 'jwt' },
        { phone: identifier, auth_type: 'jwt' }
      ],
      relations: ['roles', 'roles.permissions', 'department']
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    ```

20. **Vérification du mot de passe** :
    ```typescript
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    ```

21. **Vérifications supplémentaires** :
    ```typescript
    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }
    
    if (!user.is_verified) {
      throw new UnauthorizedException('Please verify your email first');
    }
    ```

22-23. **Récupération des rôles et permissions** :
    ```typescript
    const roles = user.roles.map(r => r.name);
    const permissions = user.roles
      .flatMap(r => r.permissions)
      .map(p => `${p.resource}:${p.action}`);
    ```

24. **Génération des tokens JWT** :
    ```typescript
    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      auth_type: 'jwt',
      roles,
      permissions
    };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m' // 15 minutes
    });
    
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d' // 7 jours
      }
    );
    ```

25-26. **Sauvegarde et audit** :
    ```typescript
    await refreshTokenRepository.create({
      user_id: user.id,
      token: refreshToken,
      device_info: req.headers['user-agent'],
      ip_address: req.ip,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    await userRepository.update(user.id, {
      last_login_at: new Date()
    });
    
    await auditLogRepository.create({
      user_id: user.id,
      action: 'login',
      details: { auth_type: 'jwt' },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });
    ```

27-28. **Réponse et stockage** :
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "uuid",
        "email": "operateur@example.com",
        "phone": "+33612345678",
        "first_name": "Marie",
        "last_name": "Martin",
        "department": {...},
        "auth_type": "jwt"
      },
      "roles": ["Operator"],
      "permissions": ["checklist:read", "checklist:submit", ...]
    }
    ```

#### Phase 3 : Refresh Token

30-31. **Token expiré** : Quand l'access token expire, l'API retourne 401

32. **Détection automatique** : Un interceptor HTTP détecte le 401

33-35. **Refresh du token** :
    ```typescript
    POST /auth/refresh
    { "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
    
    // Côté serveur
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET
    });
    
    const storedToken = await refreshTokenRepository.findOne({
      where: {
        token: refreshToken,
        user_id: payload.sub,
        revoked: false
      }
    });
    
    if (!storedToken || storedToken.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    ```

36-37. **Génération de nouveaux tokens** :
    ```typescript
    const user = await userRepository.findOne({
      where: { id: payload.sub },
      relations: ['roles', 'roles.permissions']
    });
    
    const newAccessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      auth_type: 'jwt',
      roles: user.roles.map(r => r.name),
      permissions: user.roles.flatMap(r => r.permissions).map(p => `${p.resource}:${p.action}`)
    }, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m'
    });
    
    // Optionnel : rotation du refresh token
    const newRefreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d'
      }
    );
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
    ```

38-40. **Mise à jour et retry** : Le client stocke les nouveaux tokens et réessaie la requête initiale

### Configuration NestJS pour JWT

#### Installation
```bash
npm install @nestjs/jwt passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

#### JWT Module Configuration
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
        issuer: 'factory-app',
        audience: 'factory-users'
      }
    })
  ]
})
export class AuthModule {}
```

#### JWT Strategy
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    
    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }
    
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions
    };
  }
}
```

## Sécurité et Bonnes Pratiques

### 1. Mots de passe
- **Hashing** : bcrypt avec salt rounds >= 10
- **Politique** : 
  - Minimum 8 caractères
  - Au moins une majuscule, une minuscule, un chiffre, un caractère spécial
  - Pas de mots courants (vérification contre dictionnaire)
- **Expiration** : Changement forcé tous les 90 jours (optionnel)

### 2. Tokens JWT
- **Access Token** : 
  - Durée courte (15 minutes)
  - Contient les informations minimales
  - Stocké en mémoire ou localStorage
- **Refresh Token** :
  - Durée longue (7 jours)
  - Stocké en base de données
  - Révocable manuellement
  - Rotation à chaque utilisation (optionnel)

### 3. Protection contre les attaques

#### Brute Force
```typescript
// Utilisation de rate limiting
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // 60 secondes
      limit: 5, // 5 tentatives max
    })
  ]
})
```

#### CSRF (Cross-Site Request Forgery)
```typescript
// Utilisation de CSRF tokens pour les requêtes mutantes
import * as csurf from 'csurf';
app.use(csurf());
```

#### XSS (Cross-Site Scripting)
```typescript
// Sanitisation des inputs
import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  content: string;
}
```

### 4. HTTPS/TLS
- Obligatoire en production
- Certificats valides
- HSTS (HTTP Strict Transport Security)
```typescript
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
```

### 5. Audit et Monitoring
- Logging de toutes les tentatives de connexion
- Alertes sur activités suspectes
- Révision régulière des logs d'audit

### 6. Déconnexion
```typescript
// Révocation du refresh token
POST /auth/logout
{
  "refreshToken": "..."
}

// Côté serveur
await refreshTokenRepository.update(
  { token: refreshToken },
  { revoked: true }
);
```

### 7. Gestion des sessions multiples
- Un utilisateur peut avoir plusieurs refresh tokens actifs (plusieurs appareils)
- Possibilité de voir et révoquer les sessions actives
- Révocation automatique après X jours d'inactivité

## Environnement Variables

### .env Example
```env
# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Active Directory
LDAP_URL=ldap://ad.company.local:389
LDAP_BIND_DN=CN=ServiceAccount,OU=Service,DC=company,DC=local
LDAP_BIND_PASSWORD=service-account-password
LDAP_SEARCH_BASE=DC=company,DC=local
LDAP_SEARCH_FILTER=(sAMAccountName={{username}})

# Email
SMTP_HOST=smtp.company.local
SMTP_PORT=587
SMTP_USER=noreply@company.local
SMTP_PASSWORD=smtp-password
SMTP_FROM=Factory App <noreply@company.local>

# SMS (optionnel)
SMS_PROVIDER=twilio
SMS_API_KEY=your-api-key
SMS_FROM=+33123456789
```

## Tests

### Tests Unitaires
```typescript
describe('AuthService - JWT', () => {
  it('should register a new user', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'Password123!',
      first_name: 'Test',
      last_name: 'User'
    };
    
    const result = await authService.register(dto);
    expect(result).toBeDefined();
    expect(result.email).toBe(dto.email);
  });
  
  it('should login with valid credentials', async () => {
    const result = await authService.login({
      identifier: 'test@example.com',
      password: 'Password123!'
    });
    
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });
});
```

### Tests d'Intégration
```typescript
describe('Auth E2E', () => {
  it('should complete full auth flow', async () => {
    // Register
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'e2e@example.com',
        password: 'Password123!',
        first_name: 'E2E',
        last_name: 'Test'
      })
      .expect(201);
    
    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        identifier: 'e2e@example.com',
        password: 'Password123!'
      })
      .expect(200);
    
    const { accessToken } = loginResponse.body;
    
    // Access protected route
    await request(app.getHttpServer())
      .get('/api/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
```
