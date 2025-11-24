# Documentation de Modélisation - Plateforme de Digitalisation d'Usine

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Générale](#architecture-générale)
3. [Modèle de Données](#modèle-de-données)
4. [Authentification](#authentification)
5. [Cas d'Utilisation](#cas-dutilisation)
6. [Diagrammes](#diagrammes)
7. [Spécifications Techniques](#spécifications-techniques)

---

## Vue d'ensemble

### Description du Projet

Cette plateforme vise à digitaliser la collecte et la gestion des données d'usine en proposant :

- **Une API backend** (NestJS) pour gérer toute la logique métier
- **Une application d'administration** (ReactJS) pour la gestion des tâches administratives
- **Une application web** (ReactJS) pour la collecte de données sur le terrain
- **Une application mobile** (Flutter) pour la collecte de données sur le terrain

### Objectifs Principaux

1. **Digitalisation des processus** : Remplacer les processus papier par des solutions numériques
2. **Traçabilité** : Assurer une traçabilité complète des données collectées
3. **Efficacité** : Améliorer l'efficacité de la collecte et du traitement des données
4. **Reporting** : Fournir des tableaux de bord et KPI en temps réel
5. **Approbation** : Mettre en place des workflows d'approbation pour valider les données

---

## Architecture Générale

### Stack Technologique

#### Backend
- **Framework** : NestJS (Node.js)
- **Base de données** : PostgreSQL
- **Cache/Sessions** : Redis
- **Stockage fichiers** : Object Storage (S3/MinIO)

#### Frontend Admin
- **Framework** : ReactJS
- **Authentification** : Active Directory (LDAP)

#### Frontend Web
- **Framework** : ReactJS
- **Authentification** : JWT (email/téléphone + mot de passe)

#### Frontend Mobile
- **Framework** : Flutter
- **Authentification** : JWT (email/téléphone + mot de passe)
- **Fonctionnalités** : Mode offline, synchronisation

### Architecture en Couches

```
┌─────────────────────────────────────────┐
│         Frontend (ReactJS/Flutter)      │
├─────────────────────────────────────────┤
│         API Gateway / Load Balancer     │
├─────────────────────────────────────────┤
│         API NestJS (Modules)            │
├─────────────────────────────────────────┤
│         Services (LDAP, JWT, Email...)  │
├─────────────────────────────────────────┤
│         Data Layer (PostgreSQL/Redis)   │
└─────────────────────────────────────────┘
```

---

## Modèle de Données

### Entités Principales

#### 1. User (Utilisateur)
Représente un utilisateur du système.

**Attributs :**
- `id` : UUID (identifiant unique)
- `email` : string (email de l'utilisateur)
- `phone` : string (téléphone de l'utilisateur)
- `passwordHash` : string (hash du mot de passe pour JWT)
- `role` : UserRole (ADMIN, SUPERVISOR, OPERATOR)
- `isActive` : boolean (statut actif/inactif)
- `adUsername` : string? (nom d'utilisateur AD si applicable)
- `lastLogin` : DateTime? (dernière connexion)
- `createdAt` : DateTime
- `updatedAt` : DateTime

**Relations :**
- Crée des checklists (1..*)
- Reçoit des assignments (0..*)
- Soumet des données (0..*)
- Approuve des soumissions (0..*)

#### 2. Checklist (Checklist)
Modèle de checklist dynamique créé par les administrateurs.

**Attributs :**
- `id` : UUID
- `name` : string (nom de la checklist)
- `description` : string (description)
- `category` : string (catégorie)
- `isActive` : boolean
- `createdBy` : UUID (référence User)
- `createdAt` : DateTime
- `updatedAt` : DateTime

**Relations :**
- Contient des items (1..*)
- Peut être assignée (0..*)
- Peut avoir un workflow d'approbation (0..1)

#### 3. ChecklistItem (Item de Checklist)
Élément individuel d'une checklist.

**Attributs :**
- `id` : UUID
- `checklistId` : UUID (référence Checklist)
- `order` : number (ordre d'affichage)
- `label` : string (libellé)
- `type` : ItemType (TEXT, NUMBER, BOOLEAN, SELECT, etc.)
- `isRequired` : boolean (champ obligatoire)
- `options` : JSON? (options pour SELECT/MULTI_SELECT)
- `validationRules` : JSON? (règles de validation)
- `createdAt` : DateTime

**Types d'items supportés :**
- TEXT : Texte libre
- NUMBER : Nombre
- BOOLEAN : Oui/Non
- SELECT : Sélection unique
- MULTI_SELECT : Sélection multiple
- DATE : Date
- TIME : Heure
- DATETIME : Date et heure
- FILE : Fichier (photo, document)
- SIGNATURE : Signature électronique
- LOCATION : Géolocalisation

#### 4. ChecklistAssignment (Attribution de Checklist)
Attribution d'une checklist à un utilisateur.

**Attributs :**
- `id` : UUID
- `checklistId` : UUID (référence Checklist)
- `assignedTo` : UUID (référence User - destinataire)
- `assignedBy` : UUID (référence User - assigneur)
- `dueDate` : DateTime? (date limite)
- `status` : AssignmentStatus (PENDING, IN_PROGRESS, COMPLETED, CANCELLED, OVERDUE)
- `priority` : Priority (LOW, MEDIUM, HIGH, URGENT)
- `notes` : string? (notes additionnelles)
- `assignedAt` : DateTime
- `completedAt` : DateTime?

#### 5. ChecklistSubmission (Soumission de Checklist)
Données collectées par un opérateur.

**Attributs :**
- `id` : UUID
- `checklistId` : UUID (référence Checklist)
- `assignmentId` : UUID (référence ChecklistAssignment)
- `submittedBy` : UUID (référence User)
- `status` : SubmissionStatus (DRAFT, SUBMITTED, APPROVED, REJECTED)
- `submittedAt` : DateTime
- `approvedAt` : DateTime?
- `approvedBy` : UUID? (référence User)
- `rejectedAt` : DateTime?
- `rejectedBy` : UUID? (référence User)
- `rejectionReason` : string?
- `signature` : string? (signature électronique)
- `location` : JSON? (géolocalisation)
- `metadata` : JSON (métadonnées additionnelles)

#### 6. ChecklistAnswer (Réponse à un Item)
Réponse à un item spécifique d'une checklist.

**Attributs :**
- `id` : UUID
- `submissionId` : UUID (référence ChecklistSubmission)
- `itemId` : UUID (référence ChecklistItem)
- `value` : JSON (valeur de la réponse)
- `files` : JSON? (références aux fichiers attachés)
- `comments` : string? (commentaires)
- `answeredAt` : DateTime

#### 7. ApprovalWorkflow (Workflow d'Approbation)
Définit le processus d'approbation pour une checklist.

**Attributs :**
- `id` : UUID
- `checklistId` : UUID (référence Checklist)
- `name` : string
- `steps` : JSON (configuration des étapes)
- `isActive` : boolean
- `createdAt` : DateTime

#### 8. Approval (Approbation)
Approbation individuelle dans le workflow.

**Attributs :**
- `id` : UUID
- `submissionId` : UUID (référence ChecklistSubmission)
- `stepId` : UUID (référence ApprovalStep)
- `approverId` : UUID (référence User)
- `status` : ApprovalStatus (PENDING, APPROVED, REJECTED)
- `comments` : string?
- `approvedAt` : DateTime?

#### 9. KPI (Indicateur de Performance)
Définition d'un KPI.

**Attributs :**
- `id` : UUID
- `name` : string
- `description` : string
- `formula` : string (formule de calcul)
- `category` : string
- `unit` : string? (unité de mesure)
- `target` : number? (objectif)
- `isActive` : boolean
- `createdAt` : DateTime

#### 10. Notification (Notification)
Notification envoyée aux utilisateurs.

**Attributs :**
- `id` : UUID
- `userId` : UUID (référence User)
- `type` : NotificationType (ASSIGNMENT, APPROVAL_REQUEST, APPROVAL_RESULT, REMINDER, SYSTEM)
- `title` : string
- `message` : string
- `isRead` : boolean
- `relatedEntityType` : string? (type d'entité liée)
- `relatedEntityId` : UUID? (ID de l'entité liée)
- `createdAt` : DateTime
- `readAt` : DateTime?

---

## Authentification

### Authentification Active Directory (Partie Admin)

L'authentification AD est utilisée pour les administrateurs et superviseurs accédant à l'application d'administration.

#### Flux d'Authentification

1. **Connexion**
   - L'utilisateur saisit son username et password AD
   - L'API effectue une requête LDAP Bind vers Active Directory
   - Si réussie, l'API récupère les informations utilisateur (DN, groupes, email)
   - Un token JWT est généré avec les claims AD (groupes, rôles)
   - Le token est retourné au client

2. **Vérification de Session**
   - Le client envoie le token JWT dans le header Authorization
   - L'API valide le token et vérifie que l'utilisateur est toujours actif dans AD
   - Les informations utilisateur sont retournées

3. **Rafraîchissement de Token**
   - Si le token expire, un refresh token est utilisé pour obtenir un nouveau token
   - Le refresh token est vérifié et un nouveau access token est généré

4. **Déconnexion**
   - Le token est invalidé côté serveur
   - Le client supprime le token du stockage local

**Voir diagramme de séquence :** `diagrammes/auth-ad-sequence.puml`

### Authentification JWT (Partie Web/Mobile)

L'authentification JWT est utilisée pour les opérateurs terrain accédant aux applications web et mobile.

#### Flux d'Authentification

1. **Inscription**
   - L'utilisateur saisit email/téléphone et mot de passe
   - L'API vérifie que l'email/téléphone n'existe pas déjà
   - Le mot de passe est hashé (bcrypt)
   - Un utilisateur est créé avec le rôle OPERATOR
   - Un token JWT est généré et retourné

2. **Connexion**
   - L'utilisateur saisit email/téléphone et mot de passe
   - L'API recherche l'utilisateur par email ou téléphone
   - Le mot de passe est vérifié (bcrypt.compare)
   - Si correct, un token JWT est généré et retourné

3. **Réinitialisation de Mot de Passe**
   - L'utilisateur demande une réinitialisation via email/téléphone
   - Un token de reset est généré (expire dans 1h)
   - Un email/SMS est envoyé avec le lien de reset
   - L'utilisateur clique sur le lien et définit un nouveau mot de passe
   - Le token de reset est invalidé

4. **Vérification de Session**
   - Le client envoie le token JWT dans le header Authorization
   - L'API valide le token (signature, expiration)
   - L'utilisateur est vérifié dans la base de données
   - Si actif, les informations sont retournées

5. **Déconnexion**
   - Le refresh token est invalidé côté serveur
   - Le client supprime les tokens du stockage local

**Voir diagramme de séquence :** `diagrammes/auth-jwt-sequence.puml`

---

## Cas d'Utilisation

### Partie Administration

#### Acteurs
- **Administrateur** : Accès complet à toutes les fonctionnalités
- **Superviseur** : Accès limité aux fonctionnalités de supervision

#### Fonctionnalités Principales

1. **Gestion des Utilisateurs**
   - Créer, modifier, supprimer des utilisateurs
   - Gérer les rôles et permissions
   - Activer/désactiver des comptes

2. **Gestion des Checklists**
   - Créer des checklists dynamiques avec différents types d'items
   - Modifier et supprimer des checklists
   - Activer/désactiver des checklists

3. **Attribution de Checklists**
   - Attribuer des checklists à des opérateurs
   - Définir des dates limites
   - Définir des priorités
   - Ajouter des notes

4. **Approbation**
   - Consulter les soumissions en attente
   - Approuver ou rejeter des soumissions
   - Ajouter des commentaires

5. **Dashboard et KPI**
   - Consulter le dashboard avec widgets personnalisables
   - Visualiser les KPI en temps réel
   - Générer des rapports
   - Exporter des données

6. **Configuration**
   - Configurer les paramètres système
   - Gérer les workflows d'approbation
   - Consulter l'historique des actions

### Partie Terrain (Web/Mobile)

#### Acteur
- **Opérateur Terrain** : Collecte les données sur le terrain

#### Fonctionnalités Principales

1. **Authentification**
   - Se connecter avec email/téléphone et mot de passe
   - S'inscrire (si autorisé)
   - Réinitialiser le mot de passe

2. **Consultation des Checklists**
   - Consulter les checklists assignées
   - Voir les détails (items, instructions, date limite)

3. **Collecte de Données**
   - Remplir une checklist
   - Ajouter des photos
   - Ajouter des commentaires
   - Signer électroniquement
   - Sauvegarder en brouillon

4. **Soumission**
   - Soumettre une checklist complétée
   - Consulter l'historique des soumissions
   - Voir le statut d'approbation

5. **Fonctionnalités Mobile Spécifiques**
   - Mode offline (sauvegarde locale)
   - Synchronisation automatique
   - Notifications push

**Voir diagramme de cas d'utilisation :** `diagrammes/use-cases.puml`

---

## Diagrammes

Tous les diagrammes sont disponibles au format PlantUML (.puml) dans le dossier `diagrammes/` :

1. **auth-ad-sequence.puml** : Diagramme de séquence pour l'authentification AD
2. **auth-jwt-sequence.puml** : Diagramme de séquence pour l'authentification JWT
3. **use-cases.puml** : Diagramme de cas d'utilisation
4. **class-diagram.puml** : Diagramme de classes (modèle de données)
5. **architecture.puml** : Diagramme d'architecture système

### Visualisation des Diagrammes

Pour visualiser les diagrammes PlantUML, vous pouvez :

1. **Utiliser un outil en ligne** : http://www.plantuml.com/plantuml/uml/
2. **Installer PlantUML localement** :
   ```bash
   npm install -g node-plantuml
   plantuml diagrammes/*.puml
   ```
3. **Utiliser VS Code** avec l'extension PlantUML
4. **Utiliser IntelliJ IDEA** avec le plugin PlantUML

---

## Spécifications Techniques

### API Endpoints Principaux

#### Authentification AD
- `POST /auth/ad/login` : Connexion via AD
- `POST /auth/ad/refresh` : Rafraîchir le token
- `GET /auth/me` : Obtenir les informations utilisateur
- `POST /auth/logout` : Déconnexion

#### Authentification JWT
- `POST /auth/register` : Inscription
- `POST /auth/login` : Connexion
- `POST /auth/forgot-password` : Demande de réinitialisation
- `POST /auth/reset-password` : Réinitialisation du mot de passe
- `POST /auth/refresh` : Rafraîchir le token
- `GET /auth/me` : Obtenir les informations utilisateur
- `POST /auth/logout` : Déconnexion

#### Checklists
- `GET /checklists` : Liste des checklists
- `POST /checklists` : Créer une checklist
- `GET /checklists/:id` : Détails d'une checklist
- `PUT /checklists/:id` : Modifier une checklist
- `DELETE /checklists/:id` : Supprimer une checklist
- `POST /checklists/:id/items` : Ajouter un item
- `PUT /checklists/:id/items/:itemId` : Modifier un item
- `DELETE /checklists/:id/items/:itemId` : Supprimer un item

#### Assignments
- `GET /assignments` : Liste des assignments
- `POST /assignments` : Créer un assignment
- `GET /assignments/:id` : Détails d'un assignment
- `PUT /assignments/:id` : Modifier un assignment
- `DELETE /assignments/:id` : Annuler un assignment

#### Submissions
- `GET /submissions` : Liste des submissions
- `POST /submissions` : Créer/soumettre une submission
- `GET /submissions/:id` : Détails d'une submission
- `PUT /submissions/:id` : Modifier une submission (brouillon)
- `POST /submissions/:id/submit` : Soumettre une submission
- `POST /submissions/:id/approve` : Approuver une submission
- `POST /submissions/:id/reject` : Rejeter une submission

#### Dashboard & KPI
- `GET /dashboard` : Données du dashboard
- `GET /kpis` : Liste des KPIs
- `GET /kpis/:id/values` : Valeurs d'un KPI
- `POST /kpis` : Créer un KPI
- `GET /reports` : Générer un rapport

#### Notifications
- `GET /notifications` : Liste des notifications
- `PUT /notifications/:id/read` : Marquer comme lu
- `PUT /notifications/read-all` : Tout marquer comme lu

### Sécurité

1. **Authentification**
   - JWT avec expiration (15 min pour access token, 7 jours pour refresh token)
   - Hashage des mots de passe avec bcrypt (10 rounds)
   - Validation des tokens côté serveur

2. **Autorisation**
   - Contrôle d'accès basé sur les rôles (RBAC)
   - Middleware d'authentification sur toutes les routes protégées
   - Vérification des permissions pour les actions sensibles

3. **Validation**
   - Validation des données d'entrée (class-validator)
   - Sanitization des données
   - Protection contre les injections SQL (ORM)

4. **Sécurité des Fichiers**
   - Validation des types MIME
   - Limitation de la taille des fichiers
   - Stockage sécurisé (Object Storage)

### Performance

1. **Cache**
   - Redis pour le cache des données fréquemment accédées
   - Cache des sessions utilisateur
   - Cache des KPIs calculés

2. **Optimisation des Requêtes**
   - Pagination sur les listes
   - Eager loading pour éviter les N+1 queries
   - Index sur les colonnes fréquemment interrogées

3. **Synchronisation Mobile**
   - Mode offline avec stockage local
   - Synchronisation incrémentale
   - Gestion des conflits

### Déploiement

1. **Environnements**
   - Development
   - Staging
   - Production

2. **CI/CD**
   - Tests automatiques
   - Build automatique
   - Déploiement automatique

3. **Monitoring**
   - Logs centralisés
   - Monitoring des performances
   - Alertes en cas d'erreur

---

## Conclusion

Cette modélisation fournit une base solide pour le développement de la plateforme de digitalisation d'usine. Elle couvre :

- ✅ L'architecture complète du système
- ✅ Le modèle de données détaillé
- ✅ Les flux d'authentification (AD et JWT)
- ✅ Les cas d'utilisation pour chaque partie
- ✅ Les spécifications techniques

Les diagrammes PlantUML peuvent être générés en images pour la documentation ou utilisés directement dans les outils de développement.

---

**Date de création** : 2024
**Version** : 1.0
