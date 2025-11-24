# Diagramme de Cas d'Utilisation

## Vue d'ensemble
Ce diagramme présente les différents acteurs du système et leurs cas d'utilisation principaux.

## Diagramme de cas d'utilisation global

```mermaid
graph TB
    subgraph "Acteurs Externes"
        AD[Active Directory]
        SMTP[Serveur Email]
        SMS[Service SMS]
        S3[Stockage S3]
    end

    subgraph "Acteurs Humains"
        Admin[Administrateur Système]
        Manager[Manager/Superviseur]
        Operator[Opérateur Terrain]
        Viewer[Visualisateur]
        Guest[Invité]
    end

    subgraph "Système de Gestion des Données d'Usine"
        subgraph "Authentification et Autorisation"
            UC1[Se connecter via AD]
            UC2[Se connecter via JWT]
            UC3[Gérer les sessions]
            UC4[Réinitialiser mot de passe]
            UC5[Activer 2FA]
        end

        subgraph "Gestion des Utilisateurs"
            UC10[Créer utilisateur]
            UC11[Modifier profil]
            UC12[Gérer les rôles]
            UC13[Gérer les permissions]
            UC14[Désactiver compte]
        end

        subgraph "Gestion des Checklists"
            UC20[Créer checklist]
            UC21[Modifier checklist]
            UC22[Dupliquer checklist]
            UC23[Publier checklist]
            UC24[Archiver checklist]
            UC25[Importer/Exporter]
        end

        subgraph "Attribution et Planification"
            UC30[Attribuer checklist]
            UC31[Planifier récurrence]
            UC32[Modifier attribution]
            UC33[Annuler attribution]
            UC34[Envoyer rappels]
        end

        subgraph "Collecte de Données"
            UC40[Remplir checklist]
            UC41[Sauvegarder brouillon]
            UC42[Ajouter photos]
            UC43[Signer électroniquement]
            UC44[Géolocaliser]
            UC45[Mode hors ligne]
        end

        subgraph "Workflow d'Approbation"
            UC50[Soumettre pour approbation]
            UC51[Approuver soumission]
            UC52[Rejeter soumission]
            UC53[Demander clarification]
            UC54[Escalader approbation]
        end

        subgraph "Tableaux de Bord et Rapports"
            UC60[Voir dashboard]
            UC61[Créer widgets]
            UC62[Configurer KPIs]
            UC63[Générer rapports]
            UC64[Exporter données]
            UC65[Programmer rapports]
        end

        subgraph "Administration Système"
            UC70[Configurer système]
            UC71[Gérer départements]
            UC72[Voir logs d'audit]
            UC73[Gérer intégrations]
            UC74[Sauvegarder données]
        end

        subgraph "Notifications"
            UC80[Recevoir notifications]
            UC81[Configurer alertes]
            UC82[Gérer préférences]
        end
    end

    %% Relations Admin
    Admin --> UC1
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
    Admin --> UC70
    Admin --> UC71
    Admin --> UC72
    Admin --> UC73
    Admin --> UC74

    %% Relations Manager
    Manager --> UC1
    Manager --> UC20
    Manager --> UC21
    Manager --> UC22
    Manager --> UC23
    Manager --> UC24
    Manager --> UC25
    Manager --> UC30
    Manager --> UC31
    Manager --> UC32
    Manager --> UC33
    Manager --> UC51
    Manager --> UC52
    Manager --> UC53
    Manager --> UC54
    Manager --> UC60
    Manager --> UC61
    Manager --> UC62
    Manager --> UC63
    Manager --> UC64
    Manager --> UC65

    %% Relations Operator
    Operator --> UC2
    Operator --> UC4
    Operator --> UC40
    Operator --> UC41
    Operator --> UC42
    Operator --> UC43
    Operator --> UC44
    Operator --> UC45
    Operator --> UC50
    Operator --> UC80
    Operator --> UC82

    %% Relations Viewer
    Viewer --> UC2
    Viewer --> UC60
    Viewer --> UC64

    %% Relations Guest
    Guest --> UC2

    %% Relations Systèmes Externes
    UC1 --> AD
    UC34 --> SMTP
    UC34 --> SMS
    UC42 --> S3
    UC80 --> SMTP
    UC80 --> SMS

    %% Includes et Extends
    UC40 -.includes.-> UC41
    UC40 -.includes.-> UC42
    UC40 -.includes.-> UC43
    UC50 -.extends.-> UC51
    UC50 -.extends.-> UC52
    UC30 -.includes.-> UC34
```

## Cas d'utilisation détaillés par module

### Module Authentification

```mermaid
graph LR
    subgraph "Acteurs"
        Admin[Administrateur]
        User[Utilisateur]
        System[Système]
    end

    subgraph "Cas d'Utilisation Authentification"
        UC1[Se connecter]
        UC2[Se déconnecter]
        UC3[Vérifier identité]
        UC4[Générer token]
        UC5[Rafraîchir token]
        UC6[Révoquer token]
        UC7[Activer 2FA]
        UC8[Désactiver 2FA]
        UC9[Vérifier OTP]
        UC10[Réinitialiser MDP]
    end

    Admin --> UC1
    Admin --> UC7
    Admin --> UC8
    User --> UC1
    User --> UC2
    User --> UC10
    
    UC1 --> UC3
    UC3 --> UC4
    UC4 --> UC5
    UC2 --> UC6
    UC7 --> UC9
    
    System --> UC5
    System --> UC6
```

### Module Gestion des Checklists

```mermaid
graph LR
    subgraph "Acteurs"
        Manager[Manager]
        QA[Responsable Qualité]
        Operator[Opérateur]
    end

    subgraph "Cas d'Utilisation Checklists"
        UC20[Créer template]
        UC21[Créer checklist]
        UC22[Configurer items]
        UC23[Définir validations]
        UC24[Définir logique conditionnelle]
        UC25[Prévisualiser]
        UC26[Tester checklist]
        UC27[Publier version]
        UC28[Gérer versions]
        UC29[Cloner checklist]
    end

    Manager --> UC20
    Manager --> UC21
    Manager --> UC27
    Manager --> UC29
    
    QA --> UC21
    QA --> UC22
    QA --> UC23
    QA --> UC24
    QA --> UC25
    QA --> UC26
    QA --> UC28
    
    Operator --> UC25
    Operator --> UC26
    
    UC21 --> UC22
    UC22 --> UC23
    UC23 --> UC24
    UC24 --> UC25
    UC25 --> UC26
    UC26 --> UC27
```

### Module Collecte de Données

```mermaid
graph LR
    subgraph "Acteurs"
        Operator[Opérateur]
        Mobile[App Mobile]
        Web[App Web]
        System[Système]
    end

    subgraph "Cas d'Utilisation Collecte"
        UC40[Accéder checklist]
        UC41[Remplir données]
        UC42[Valider saisie]
        UC43[Capturer photo]
        UC44[Enregistrer GPS]
        UC45[Signer document]
        UC46[Mode offline]
        UC47[Synchroniser]
        UC48[Sauvegarder brouillon]
        UC49[Soumettre]
    end

    Operator --> UC40
    Operator --> UC41
    Operator --> UC43
    Operator --> UC45
    Operator --> UC48
    Operator --> UC49
    
    Mobile --> UC46
    Mobile --> UC47
    Web --> UC41
    
    System --> UC42
    System --> UC44
    System --> UC47
    
    UC40 --> UC41
    UC41 --> UC42
    UC41 --> UC43
    UC41 --> UC44
    UC41 --> UC48
    UC42 --> UC49
    UC49 --> UC45
    UC46 --> UC47
```

### Module Dashboard et Reporting

```mermaid
graph LR
    subgraph "Acteurs"
        Manager[Manager]
        Analyst[Analyste]
        Executive[Direction]
        System[Système]
    end

    subgraph "Cas d'Utilisation Dashboard"
        UC60[Créer dashboard]
        UC61[Ajouter widget]
        UC62[Configurer source données]
        UC63[Définir KPI]
        UC64[Créer graphique]
        UC65[Créer tableau]
        UC66[Appliquer filtres]
        UC67[Exporter vue]
        UC68[Partager dashboard]
        UC69[Programmer refresh]
    end

    Manager --> UC60
    Manager --> UC61
    Manager --> UC63
    Manager --> UC68
    
    Analyst --> UC62
    Analyst --> UC64
    Analyst --> UC65
    Analyst --> UC66
    Analyst --> UC67
    
    Executive --> UC66
    Executive --> UC67
    
    System --> UC69
    
    UC60 --> UC61
    UC61 --> UC62
    UC62 --> UC63
    UC63 --> UC64
    UC63 --> UC65
    UC64 --> UC66
    UC65 --> UC66
```

## Matrice des cas d'utilisation par acteur

| Acteur | Cas d'utilisation principaux | Fréquence | Criticité |
|--------|------------------------------|-----------|-----------|
| **Administrateur** | Gérer utilisateurs, Configurer système, Voir audit logs | Quotidien | Haute |
| **Manager** | Créer checklists, Attribuer tâches, Approuver soumissions, Voir dashboards | Quotidien | Haute |
| **Opérateur** | Remplir checklists, Soumettre données, Consulter planning | Multiple/jour | Critique |
| **Responsable Qualité** | Définir standards, Valider processus, Analyser conformité | Hebdomadaire | Haute |
| **Analyste** | Créer rapports, Analyser tendances, Exporter données | Quotidien | Moyenne |
| **Direction** | Consulter KPIs, Voir dashboards exécutifs, Recevoir alertes | Hebdomadaire | Moyenne |
| **Invité** | Voir dashboards publics, Consulter rapports partagés | Occasionnel | Basse |

## Cas d'utilisation critiques avec préconditions et postconditions

### UC40: Remplir checklist

**Acteur principal**: Opérateur

**Préconditions**:
- L'opérateur est authentifié
- Une checklist est assignée à l'opérateur
- La checklist est dans la période de validité

**Scénario principal**:
1. L'opérateur accède à sa liste de tâches
2. L'opérateur sélectionne une checklist assignée
3. Le système affiche le formulaire de la checklist
4. L'opérateur remplit chaque champ requis
5. L'opérateur peut ajouter des photos si nécessaire
6. Le système valide les données en temps réel
7. L'opérateur signe électroniquement
8. L'opérateur soumet la checklist
9. Le système confirme la soumission

**Postconditions**:
- Les données sont sauvegardées en base
- Un workflow d'approbation est déclenché si nécessaire
- L'opérateur reçoit une confirmation
- Les KPIs sont mis à jour

**Scénarios alternatifs**:
- 4a. Mode hors ligne activé
  - Les données sont stockées localement
  - Synchronisation lors de la reconnexion
- 6a. Validation échouée
  - Message d'erreur affiché
  - Retour à l'étape 4

### UC51: Approuver soumission

**Acteur principal**: Manager/Superviseur

**Préconditions**:
- Le manager a les permissions d'approbation
- Une soumission est en attente d'approbation
- Le manager est dans la chaîne d'approbation

**Scénario principal**:
1. Le manager reçoit une notification d'approbation
2. Le manager accède à la soumission
3. Le manager examine les données soumises
4. Le manager peut consulter l'historique
5. Le manager peut demander des clarifications
6. Le manager approuve la soumission
7. Le système enregistre l'approbation
8. Le système notifie les parties concernées

**Postconditions**:
- Le statut de la soumission est mis à jour
- L'audit log est créé
- Les notifications sont envoyées
- Le workflow continue ou se termine

## Diagramme de contexte système

```mermaid
graph TB
    subgraph "Contexte Externe"
        Users[Utilisateurs<br/>- Admins<br/>- Managers<br/>- Opérateurs]
        ExtSys[Systèmes Externes<br/>- Active Directory<br/>- Email/SMS<br/>- Stockage]
        Devices[Appareils<br/>- PC/Web<br/>- Tablettes<br/>- Smartphones]
        Regulations[Réglementations<br/>- Normes qualité<br/>- Conformité<br/>- Audit]
    end

    subgraph "Système Central"
        Platform[Plateforme de Gestion<br/>des Données d'Usine]
    end

    subgraph "Sorties"
        Reports[Rapports<br/>- PDF<br/>- Excel<br/>- CSV]
        Dashboards[Tableaux de bord<br/>- KPIs<br/>- Graphiques<br/>- Alertes]
        Notifications[Notifications<br/>- Email<br/>- SMS<br/>- Push]
        Exports[Exports<br/>- Données<br/>- Archives<br/>- Backups]
    end

    Users --> Platform
    Devices --> Platform
    ExtSys <--> Platform
    Regulations --> Platform
    
    Platform --> Reports
    Platform --> Dashboards
    Platform --> Notifications
    Platform --> Exports

    style Platform fill:#f9f,stroke:#333,stroke-width:4px
```

## Cas d'utilisation pour l'intégration mobile

```mermaid
graph LR
    subgraph "Acteur Mobile"
        MobileUser[Opérateur Mobile]
        MobileApp[Application Flutter]
    end

    subgraph "Cas d'Utilisation Mobile Spécifiques"
        UC100[Télécharger checklists offline]
        UC101[Travailler hors connexion]
        UC102[Synchroniser données]
        UC103[Utiliser appareil photo]
        UC104[Scanner code-barres/QR]
        UC105[Utiliser GPS]
        UC106[Recevoir push notifications]
        UC107[Signature tactile]
        UC108[Commande vocale]
        UC109[Mode sombre]
    end

    MobileUser --> MobileApp
    MobileApp --> UC100
    MobileApp --> UC101
    MobileApp --> UC102
    MobileApp --> UC103
    MobileApp --> UC104
    MobileApp --> UC105
    MobileApp --> UC106
    MobileApp --> UC107
    MobileApp --> UC108
    MobileApp --> UC109
    
    UC100 --> UC101
    UC101 --> UC102
    UC103 --> UC107
```

## Priorisation des cas d'utilisation (MoSCoW)

### Must Have (Obligatoire)
- Se connecter (AD & JWT)
- Gérer utilisateurs et permissions
- Créer et publier checklists
- Attribuer checklists
- Remplir et soumettre checklists
- Workflow d'approbation basique
- Dashboard simple avec KPIs essentiels
- Notifications email

### Should Have (Important)
- Mode hors ligne
- Signature électronique
- Capture photo/vidéo
- Rapports personnalisés
- Planification récurrente
- Audit trail complet
- Export données

### Could Have (Souhaitable)
- Intégration calendrier
- Commande vocale
- Analytics avancés
- Prédictions IA
- Chatbot support
- API publique

### Won't Have (Exclu pour cette version)
- Intégration ERP complète
- Module de maintenance prédictive
- Réalité augmentée
- Blockchain pour traçabilité