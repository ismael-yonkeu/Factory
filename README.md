# Factory - Plateforme de Collecte et Gestion des Données d'Usine

## 🏭 Vue d'ensemble

Plateforme complète de digitalisation pour la collecte et la gestion des données en milieu industriel. Cette solution permet la création de checklists dynamiques, la collecte de données terrain en temps réel, et le suivi des performances via des tableaux de bord personnalisés.

## 🚀 Architecture

### Stack Technologique

- **Backend API** : NestJS (Node.js/TypeScript)
- **Admin Web** : ReactJS avec Material-UI
- **Web Terrain** : ReactJS optimisé mobile
- **Application Mobile** : Flutter (iOS/Android)
- **Base de données** : PostgreSQL 15
- **Cache** : Redis 7
- **Message Queue** : RabbitMQ
- **Conteneurisation** : Docker & Kubernetes

### Authentification

- **Interface Admin** : Active Directory (LDAP)
- **Applications Terrain** : JWT avec 2FA optionnel

## 📚 Documentation Complète

### 📊 Diagrammes d'Architecture

- [Architecture Système](./documentation/diagrammes/architecture-systeme.md) - Vue globale de l'infrastructure
- [Diagramme de Classes UML](./documentation/diagrammes/diagramme-classes.md) - Modèle objet complet
- [Diagramme de Base de Données](./documentation/diagrammes/diagramme-bdd.md) - Schéma PostgreSQL détaillé
- [Cas d'Utilisation](./documentation/diagrammes/cas-utilisation.md) - Interactions utilisateurs
- [Diagramme de Déploiement](./documentation/diagrammes/deploiement.md) - Infrastructure et DevOps

### 🔐 Diagrammes de Séquence - Authentification

- [Authentification Active Directory](./documentation/diagrammes/sequence-auth-ad.md) - Flow complet pour les administrateurs
- [Authentification JWT](./documentation/diagrammes/sequence-auth-jwt.md) - Flow pour les opérateurs terrain

### 📋 Spécifications

- [Spécifications Fonctionnelles](./documentation/specifications/spec-fonctionnelles.md) - Exigences métier détaillées
- [Spécifications Techniques](./documentation/specifications/spec-techniques.md) - Architecture et implémentation
- [Guide de Sécurité](./documentation/specifications/securite.md) - Mesures et bonnes pratiques

## 🎯 Fonctionnalités Principales

### Module Administration
- ✅ Tableaux de bord personnalisables
- ✅ Gestion des KPI en temps réel
- ✅ Création de checklists dynamiques
- ✅ Attribution et planification des tâches
- ✅ Workflows d'approbation configurables
- ✅ Génération de rapports automatisés

### Module Terrain (Web & Mobile)
- ✅ Collecte de données hors ligne
- ✅ Capture photo/vidéo avec annotation
- ✅ Signature électronique
- ✅ Géolocalisation automatique
- ✅ Synchronisation en arrière-plan
- ✅ Notifications push

### Sécurité
- ✅ Authentification multi-modes (AD/JWT)
- ✅ Double authentification (2FA)
- ✅ Chiffrement de bout en bout
- ✅ Audit trail complet
- ✅ Conformité GDPR
- ✅ Gestion des permissions RBAC

## 🛠️ Installation et Démarrage

### Prérequis

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Démarrage Rapide

1. Cloner le repository
```bash
git clone https://github.com/company/factory-platform.git
cd factory-platform
```

2. Configuration environnement
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

3. Lancer avec Docker Compose
```bash
docker-compose up -d
```

4. Accéder aux applications
- API : http://localhost:3000
- Admin : http://localhost:3001
- Web Terrain : http://localhost:3002
- Documentation API : http://localhost:3000/api-docs

## 📈 Indicateurs de Performance

| Métrique | Cible | Actuel |
|----------|-------|--------|
| Disponibilité | 99.9% | - |
| Temps de réponse API (P95) | < 200ms | - |
| Utilisateurs simultanés | 1000+ | - |
| Taux de synchronisation offline | 100% | - |

## 🔄 CI/CD et DevOps

- **CI/CD** : GitLab CI avec pipelines automatisés
- **Orchestration** : Kubernetes avec auto-scaling
- **Monitoring** : Prometheus + Grafana
- **Logs** : ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM** : Application Performance Monitoring

## 👥 Équipe Projet

- **Product Owner** : Définition des besoins
- **Architecte Technique** : Conception système
- **Développeurs Backend** : API NestJS
- **Développeurs Frontend** : React Admin & Terrain
- **Développeur Mobile** : Application Flutter
- **DevOps** : Infrastructure et déploiement
- **QA/Testeur** : Qualité et tests

## 📝 Licence

Propriétaire - © 2024 Company. Tous droits réservés.

## 📞 Support

Pour toute question ou assistance :
- Email : support@factory-platform.com
- Documentation : [Voir documentation complète](./documentation/README.md)
