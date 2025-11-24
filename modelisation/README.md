# Modélisation - Plateforme de Digitalisation d'Usine

Ce dossier contient toute la modélisation du projet de plateforme de collecte et gestion des données d'usine.

## Structure

```
modelisation/
├── diagrammes/
│   ├── auth-ad-sequence.puml          # Diagramme de séquence - Auth AD
│   ├── auth-jwt-sequence.puml         # Diagramme de séquence - Auth JWT
│   ├── use-cases.puml                 # Diagramme de cas d'utilisation
│   ├── class-diagram.puml             # Diagramme de classes (modèle de données)
│   └── architecture.puml               # Diagramme d'architecture système
├── DOCUMENTATION.md                   # Documentation complète de la modélisation
└── README.md                          # Ce fichier
```

## Diagrammes

### 1. Authentification Active Directory (Admin)
**Fichier** : `diagrammes/auth-ad-sequence.puml`

Décrit le flux d'authentification pour la partie administration utilisant Active Directory :
- Connexion via LDAP
- Vérification de session
- Rafraîchissement de token
- Déconnexion

### 2. Authentification JWT (Web/Mobile)
**Fichier** : `diagrammes/auth-jwt-sequence.puml`

Décrit le flux d'authentification pour les applications web et mobile utilisant JWT :
- Inscription
- Connexion
- Réinitialisation de mot de passe
- Vérification de session
- Déconnexion

### 3. Cas d'Utilisation
**Fichier** : `diagrammes/use-cases.puml`

Décrit tous les cas d'utilisation du système :
- Partie Administration (Admin, Superviseur)
- Partie Terrain (Opérateur)

### 4. Diagramme de Classes
**Fichier** : `diagrammes/class-diagram.puml`

Modèle de données complet avec toutes les entités :
- User, Checklist, ChecklistItem
- ChecklistAssignment, ChecklistSubmission, ChecklistAnswer
- ApprovalWorkflow, Approval
- KPI, Notification
- Et leurs relations

### 5. Architecture Système
**Fichier** : `diagrammes/architecture.puml`

Architecture complète du système :
- Frontend (Admin, Web, Mobile)
- Backend (API NestJS)
- Services (LDAP, JWT, Email, SMS, etc.)
- Data Layer (PostgreSQL, Redis, Object Storage)
- Services externes (AD, Email Server, SMS Gateway)

## Visualisation des Diagrammes

### Option 1 : PlantUML Online
1. Aller sur http://www.plantuml.com/plantuml/uml/
2. Copier le contenu d'un fichier .puml
3. Coller dans l'éditeur
4. Le diagramme sera généré automatiquement

### Option 2 : PlantUML Local
```bash
# Installer PlantUML
npm install -g node-plantuml

# Générer les diagrammes
cd modelisation/diagrammes
plantuml *.puml
```

### Option 3 : VS Code
1. Installer l'extension "PlantUML" dans VS Code
2. Ouvrir un fichier .puml
3. Utiliser `Alt+D` pour prévisualiser

### Option 4 : IntelliJ IDEA
1. Installer le plugin PlantUML
2. Ouvrir un fichier .puml
3. Le diagramme sera affiché automatiquement

## Documentation

Consultez `DOCUMENTATION.md` pour une documentation complète incluant :
- Vue d'ensemble du projet
- Architecture détaillée
- Modèle de données complet
- Spécifications techniques
- Endpoints API
- Sécurité et performance

## Technologies Utilisées

- **PlantUML** : Langage de modélisation pour les diagrammes
- **Markdown** : Documentation

## Prochaines Étapes

1. ✅ Modélisation complète
2. ⏭️ Développement de l'API NestJS
3. ⏭️ Développement de l'application Admin (ReactJS)
4. ⏭️ Développement de l'application Web (ReactJS)
5. ⏭️ Développement de l'application Mobile (Flutter)

---

Pour toute question ou modification, référez-vous à la documentation principale dans `DOCUMENTATION.md`.
