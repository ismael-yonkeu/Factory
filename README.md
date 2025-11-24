# Factory - Plateforme de Digitalisation d'Usine

Plateforme de collecte et gestion des données d'usine.

## Structure du Projet

- **API Backend** : NestJS
- **Application Admin** : ReactJS (gestion administrative, dashboard, KPI, checklists)
- **Application Web** : ReactJS (collecte de données terrain)
- **Application Mobile** : Flutter (collecte de données terrain)

## Modélisation

La modélisation complète du projet est disponible dans le dossier `modelisation/` :

- 📊 **Diagrammes** : Tous les diagrammes au format PlantUML
- 📖 **Documentation** : Documentation complète de la modélisation

Consultez [modelisation/README.md](modelisation/README.md) pour plus de détails.

### Diagrammes Disponibles

1. **Diagramme de séquence - Auth AD** : Authentification Active Directory pour la partie admin
2. **Diagramme de séquence - Auth JWT** : Authentification JWT pour web/mobile
3. **Diagramme de cas d'utilisation** : Tous les cas d'utilisation du système
4. **Diagramme de classes** : Modèle de données complet
5. **Diagramme d'architecture** : Architecture système complète

## Authentification

- **Partie Admin** : Authentification via Active Directory (LDAP)
- **Partie Web/Mobile** : Authentification JWT (email/téléphone + mot de passe)

## Documentation

Pour la documentation complète de la modélisation, voir [modelisation/DOCUMENTATION.md](modelisation/DOCUMENTATION.md).
