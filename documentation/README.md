# Plateforme de Collecte et Gestion des Données d'Usine

## Vue d'ensemble du projet
Ce projet consiste à concevoir et développer une plateforme complète de digitalisation pour la collecte et la gestion des données d'usine. La solution comprend une API backend, une interface d'administration web, une application web pour la collecte de données sur le terrain, et une application mobile.

## Architecture technique

### Stack technologique
- **Backend API** : NestJS (Node.js/TypeScript)
- **Admin Web** : ReactJS 
- **Web Terrain** : ReactJS
- **Mobile** : Flutter
- **Base de données** : PostgreSQL
- **Authentification** : Active Directory (Admin) + JWT (Web/Mobile)
- **Cache** : Redis
- **Messagerie** : RabbitMQ / Socket.io pour temps réel

## Structure de la documentation

### 1. Diagrammes
- [Diagramme d'architecture système](./diagrammes/architecture-systeme.md)
- [Diagramme de classes UML](./diagrammes/diagramme-classes.md)
- [Diagramme de base de données](./diagrammes/diagramme-bdd.md)
- [Diagramme de séquence - Auth AD](./diagrammes/sequence-auth-ad.md)
- [Diagramme de séquence - Auth JWT](./diagrammes/sequence-auth-jwt.md)
- [Diagramme de cas d'utilisation](./diagrammes/cas-utilisation.md)
- [Diagramme de déploiement](./diagrammes/deploiement.md)

### 2. Spécifications
- [Spécifications fonctionnelles](./specifications/spec-fonctionnelles.md)
- [Spécifications techniques](./specifications/spec-techniques.md)
- [Guide de sécurité](./specifications/securite.md)

### 3. Documentation API
- [Documentation des endpoints](./api-docs/endpoints.md)
- [Modèles de données](./api-docs/models.md)
- [Guide d'intégration](./api-docs/integration.md)

## Fonctionnalités principales

### Module Administration
- Tableaux de bord et KPI
- Gestion des checklists dynamiques
- Attribution et planification des checklists
- Workflow d'approbation
- Gestion des utilisateurs et permissions
- Reporting et exports

### Module Collecte de données (Web & Mobile)
- Saisie des données terrain
- Remplissage des checklists
- Capture photo/vidéo
- Mode hors ligne avec synchronisation
- Géolocalisation
- Signature électronique

### Module API
- API RESTful avec NestJS
- Authentification multi-modes (AD/JWT)
- Gestion des permissions (RBAC)
- Validation des données
- Logging et monitoring
- WebSocket pour temps réel

## Équipe projet
- Product Owner
- Architecte technique
- Développeurs Backend (2)
- Développeurs Frontend (2)
- Développeur Mobile (1)
- DevOps (1)
- QA/Testeur (1)

## Planning prévisionnel
- **Phase 1** (2 mois) : Architecture et setup initial
- **Phase 2** (3 mois) : Développement core modules
- **Phase 3** (2 mois) : Intégration et tests
- **Phase 4** (1 mois) : Déploiement et formation

## Contact
Pour plus d'informations sur ce projet, veuillez contacter l'équipe projet.