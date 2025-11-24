# Diagrammes de Cas d'Utilisation

Ce document présente les diagrammes de cas d'utilisation pour tous les acteurs du système.

## Vue d'ensemble des Acteurs

```
┌─────────────────────────────────────────────────────────────────┐
│                         ACTEURS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Administrateur                                               │
│     - Accès complet au système                                  │
│     - Gestion des utilisateurs et rôles                         │
│     - Configuration du système                                  │
│     - Création et gestion des checklists                        │
│     - Attribution des tâches                                    │
│     - Approbation des collectes                                 │
│     - Visualisation des dashboards et KPI                       │
│                                                                  │
│  2. Superviseur                                                  │
│     - Gestion des équipes                                       │
│     - Attribution des tâches                                    │
│     - Approbation des collectes                                 │
│     - Visualisation des dashboards                              │
│     - Génération de rapports                                    │
│                                                                  │
│  3. Opérateur (Terrain)                                         │
│     - Consultation des tâches assignées                         │
│     - Collecte de données                                       │
│     - Soumission des collectes                                  │
│     - Travail en mode offline                                   │
│                                                                  │
│  4. Visualiseur                                                  │
│     - Consultation des dashboards                               │
│     - Visualisation des données                                 │
│     - Génération de rapports en lecture seule                   │
│                                                                  │
│  5. Système (Acteur externe)                                    │
│     - Active Directory                                          │
│     - Service d'email/SMS                                       │
│     - Système de fichiers                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Cas d'Utilisation - Administrateur

```
                    ┌────────────────────────────────────────┐
                    │         ADMINISTRATEUR                 │
                    └──────────────┬─────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        │                          │                          │
   ┌────▼─────┐              ┌────▼─────┐              ┌────▼─────┐
   │ Gestion  │              │ Gestion  │              │ Gestion  │
   │ Utilisat.│              │ Checklist│              │   KPI    │
   └────┬─────┘              └────┬─────┘              └────┬─────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │  Créer   │              │  Créer   │              │ Définir  │
   │ Utilisat.│              │ Checklist│              │   KPI    │
   │          │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │ Modifier │              │ Modifier │              │Configurer│
   │ Utilisat.│              │ Checklist│              │ Calcul   │
   │          │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │ Supprimer│              │ Publier  │              │ Consulter│
   │ Utilisat.│              │ Checklist│              │   KPI    │
   │          │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
        │                          │
   ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │
   │ Attribuer│              │ Archiver │
   │   Rôles  │              │ Checklist│
   │          │              │          │
   └──────────┘              └──────────┘


        ┌──────────────────────────────────────────────┐
        │                                              │
   ┌────▼─────┐              ┌──────────┐        ┌────▼─────┐
   │ Gestion  │              │ Gestion  │        │ Gestion  │
   │Attributio│              │Approbatio│        │Dashboard │
   └────┬─────┘              └────┬─────┘        └────┬─────┘
        │                          │                   │
   ┌────┴─────┐              ┌────┴─────┐        ┌────┴─────┐
   │          │              │          │        │          │
   │ Attribuer│              │ Approuver│        │  Créer   │
   │  Tâches  │              │ Collecte │        │Dashboard │
   │          │              │          │        │          │
   └──────────┘              └──────────┘        └──────────┘
        │                          │                   │
   ┌────┴─────┐              ┌────┴─────┐        ┌────┴─────┐
   │          │              │          │        │          │
   │ Modifier │              │  Rejeter │        │ Ajouter  │
   │Attribution│             │ Collecte │        │ Widgets  │
   │          │              │          │        │          │
   └──────────┘              └──────────┘        └──────────┘
        │                          │                   │
   ┌────┴─────┐              ┌────┴─────┐        ┌────┴─────┐
   │          │              │          │        │          │
   │ Annuler  │              │ Ajouter  │        │ Partager │
   │Attribution│             │Commentair│        │Dashboard │
   │          │              │          │        │          │
   └──────────┘              └──────────┘        └──────────┘
```

### Détail des Cas d'Utilisation - Administrateur

#### UC-01: Créer un Utilisateur
**Acteur** : Administrateur  
**Préconditions** : 
- L'administrateur est connecté
- Il possède le droit `user:create`

**Flux Principal** :
1. L'administrateur accède à la liste des utilisateurs
2. Il clique sur "Nouveau Utilisateur"
3. Il remplit le formulaire (email, nom, prénom, département, rôle)
4. Il soumet le formulaire
5. Le système valide les données
6. Le système crée l'utilisateur
7. Le système envoie un email d'invitation
8. Le système affiche un message de succès

**Flux Alternatifs** :
- 5a. Données invalides → Affichage d'erreurs
- 6a. Email déjà existant → Message d'erreur

#### UC-02: Créer une Checklist Dynamique
**Acteur** : Administrateur  
**Préconditions** : 
- L'administrateur est connecté
- Il possède le droit `checklist:create`

**Flux Principal** :
1. L'administrateur accède au constructeur de checklist
2. Il définit les informations générales (titre, description, catégorie, fréquence)
3. Il ajoute des sections
4. Pour chaque section, il ajoute des champs :
   - Type de champ (texte, nombre, select, photo, signature, etc.)
   - Label et description
   - Règles de validation
   - Caractère obligatoire
5. Il configure les conditions d'affichage (optionnel)
6. Il prévisualise la checklist
7. Il sauvegarde en brouillon ou publie directement
8. Le système valide la structure
9. Le système enregistre la checklist
10. Le système affiche un message de succès

**Flux Alternatifs** :
- 8a. Structure invalide → Affichage d'erreurs
- 7a. Sauvegarde en brouillon → La checklist n'est pas encore disponible pour attribution

#### UC-03: Attribuer des Tâches
**Acteur** : Administrateur / Superviseur  
**Préconditions** : 
- L'utilisateur est connecté
- Il possède le droit `assignment:create`
- Des checklists publiées existent
- Des opérateurs sont disponibles

**Flux Principal** :
1. L'utilisateur accède à la page d'attribution
2. Il sélectionne une checklist
3. Il sélectionne un ou plusieurs opérateurs
4. Il définit la date d'échéance
5. Il définit la priorité
6. Il ajoute des instructions (optionnel)
7. Il définit le lieu (optionnel)
8. Il soumet l'attribution
9. Le système crée les assignments
10. Le système envoie des notifications aux opérateurs
11. Le système affiche un message de succès

**Flux Alternatifs** :
- 9a. Opérateur non disponible → Avertissement
- 10a. Échec de notification → Logged mais n'empêche pas l'attribution

---

## 2. Cas d'Utilisation - Opérateur (Terrain)

```
                    ┌────────────────────────────────────────┐
                    │          OPÉRATEUR                     │
                    └──────────────┬─────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        │                          │                          │
   ┌────▼─────┐              ┌────▼─────┐              ┌────▼─────┐
   │Authentifi│              │ Consulter│              │ Collecte │
   │  -cation │              │  Tâches  │              │  Données │
   └────┬─────┘              └────┬─────┘              └────┬─────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │ Se       │              │ Voir     │              │ Commencer│
   │Connecter │              │ Liste    │              │ Collecte │
   │  (JWT)   │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
                                   │                          │
                             ┌────┴─────┐              ┌────┴─────┐
                             │          │              │          │
                             │ Filtrer  │              │ Remplir  │
                             │  Tâches  │              │  Champs  │
                             │          │              │          │
                             └──────────┘              └──────────┘
                                                             │
                                                       ┌────┴─────┐
                                                       │          │
                                                       │ Prendre  │
                                                       │  Photos  │
                                                       │          │
                                                       └──────────┘
                                                             │
                                                       ┌────┴─────┐
                                                       │          │
                                                       │ Signer   │
                                                       │          │
                                                       └──────────┘
                                                             │
                                                       ┌────┴─────┐
                                                       │          │
                                                       │Sauvegarder│
                                                       │ Brouillon│
                                                       └──────────┘
                                                             │
                                                       ┌────┴─────┐
                                                       │          │
                                                       │ Soumettre│
                                                       │ Collecte │
                                                       └──────────┘


        ┌──────────────────────────────────────────────┐
        │                                              │
   ┌────▼─────┐              ┌──────────┐        ┌────▼─────┐
   │ Mode     │              │ Synchroni│        │ Profil   │
   │ Offline  │              │  -sation │        │          │
   └────┬─────┘              └────┬─────┘        └────┬─────┘
        │                          │                   │
   ┌────┴─────┐              ┌────┴─────┐        ┌────┴─────┐
   │          │              │          │        │          │
   │ Travailler│             │  Sync    │        │ Consulter│
   │ Hors-ligne│             │ Manuelle │        │  Profil  │
   │          │              │          │        │          │
   └──────────┘              └──────────┘        └──────────┘
        │                          │                   │
   ┌────┴─────┐              ┌────┴─────┐        ┌────┴─────┐
   │          │              │          │        │          │
   │ Stockage │              │  Sync    │        │ Modifier │
   │  Local   │              │   Auto   │        │   Info   │
   │          │              │          │        │          │
   └──────────┘              └──────────┘        └──────────┘
        │                          │
   ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │
   │Queue Sync│              │ Résoudre │
   │          │              │ Conflits │
   │          │              │          │
   └──────────┘              └──────────┘
```

### Détail des Cas d'Utilisation - Opérateur

#### UC-10: Se Connecter (JWT)
**Acteur** : Opérateur  
**Préconditions** : 
- L'opérateur possède un compte actif
- Le compte est vérifié

**Flux Principal** :
1. L'opérateur ouvre l'application
2. Il entre son email/téléphone et mot de passe
3. Il clique sur "Se connecter"
4. Le système valide les credentials
5. Le système génère les tokens JWT
6. Le système retourne les tokens et les informations utilisateur
7. L'application stocke les tokens localement
8. L'application redirige vers la page d'accueil

**Flux Alternatifs** :
- 4a. Credentials invalides → Message d'erreur
- 4b. Compte non vérifié → Message invitant à vérifier l'email
- 4c. Compte désactivé → Message d'erreur

#### UC-11: Collecter des Données
**Acteur** : Opérateur  
**Préconditions** : 
- L'opérateur est connecté
- Une tâche lui est assignée
- La checklist est accessible (online ou en cache)

**Flux Principal** :
1. L'opérateur sélectionne une tâche assignée
2. Le système charge la checklist associée
3. Le système affiche le premier champ
4. Pour chaque champ :
   a. L'opérateur lit la question/label
   b. L'opérateur saisit la réponse selon le type de champ :
      - Texte : Saisie au clavier
      - Nombre : Saisie numérique
      - Select : Sélection d'option
      - Photo : Capture photo ou sélection galerie
      - Signature : Signature tactile
      - GPS : Capture automatique ou manuelle
   c. Le système valide la réponse
   d. Le système passe au champ suivant
5. L'opérateur peut sauvegarder en brouillon à tout moment
6. Une fois tous les champs remplis, l'opérateur soumet
7. Le système valide l'ensemble de la collecte
8. Le système marque la tâche comme terminée
9. Le système envoie les données au serveur (ou met en queue si offline)
10. Le système affiche un message de succès

**Flux Alternatifs** :
- 4c. Validation échouée → Affichage d'erreur, retour au champ
- 5a. Sauvegarde brouillon → Données stockées localement
- 7a. Champs obligatoires manquants → Message d'erreur, retour aux champs
- 9a. Mode offline → Données mises en queue de synchronisation

#### UC-12: Travailler en Mode Offline
**Acteur** : Opérateur  
**Préconditions** : 
- L'opérateur s'est connecté au moins une fois
- Des tâches sont assignées

**Flux Principal** :
1. L'opérateur perd la connexion internet
2. Le système détecte la perte de connexion
3. Le système affiche un indicateur "Mode Offline"
4. L'opérateur peut continuer à :
   - Consulter les tâches en cache
   - Commencer ou continuer une collecte
   - Remplir des champs
   - Prendre des photos (stockées localement)
   - Sauvegarder en brouillon
5. Chaque action est mise en queue de synchronisation
6. Quand la connexion revient :
   a. Le système détecte le retour de connexion
   b. Le système lance automatiquement la synchronisation
   c. Pour chaque action en queue :
      - Envoi au serveur
      - Gestion des conflits si nécessaire
      - Retrait de la queue si succès
   d. Le système affiche "Synchronisé"

**Flux Alternatifs** :
- 6c. Conflit détecté → L'opérateur doit résoudre manuellement
- 6c. Erreur serveur → L'action reste en queue, retry plus tard

---

## 3. Cas d'Utilisation - Superviseur

```
                    ┌────────────────────────────────────────┐
                    │          SUPERVISEUR                   │
                    └──────────────┬─────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        │                          │                          │
   ┌────▼─────┐              ┌────▼─────┐              ┌────▼─────┐
   │ Gestion  │              │ Suivi    │              │Approbatio│
   │  Équipe  │              │ Activité │              │          │
   └────┬─────┘              └────┬─────┘              └────┬─────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │ Attribuer│              │ Voir     │              │ Approuver│
   │  Tâches  │              │Dashboard │              │ Collecte │
   │          │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │ Réassign.│              │ Consulter│              │  Rejeter │
   │  Tâches  │              │  KPI     │              │ Collecte │
   │          │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │ Annuler  │              │ Générer  │              │ Demander │
   │  Tâches  │              │ Rapports │              │Correction│
   │          │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
```

### Détail des Cas d'Utilisation - Superviseur

#### UC-20: Approuver une Collecte
**Acteur** : Superviseur / Administrateur  
**Préconditions** : 
- L'utilisateur est connecté
- Il possède le droit `approval:approve`
- Une collecte est soumise et en attente d'approbation

**Flux Principal** :
1. Le superviseur accède à la file d'approbation
2. Le système affiche la liste des collectes en attente
3. Le superviseur sélectionne une collecte
4. Le système affiche les détails de la collecte
5. Le superviseur examine les données :
   - Champs remplis
   - Photos/documents
   - Signatures
   - Localisation
6. Le superviseur décide :
   - Option A : Approuver
   - Option B : Rejeter
   - Option C : Demander correction
7A. Si approbation :
   a. Le superviseur peut ajouter un commentaire
   b. Il clique sur "Approuver"
   c. Le système change le statut à "Approuvé"
   d. Le système notifie l'opérateur
   e. Le système passe à l'étape suivante du workflow (si existe)
7B. Si rejet :
   a. Le superviseur doit ajouter un commentaire (obligatoire)
   b. Il clique sur "Rejeter"
   c. Le système change le statut à "Rejeté"
   d. Le système notifie l'opérateur avec le motif
7C. Si correction demandée :
   a. Le superviseur liste les champs à corriger
   b. Il ajoute des commentaires
   c. Il clique sur "Demander correction"
   d. Le système renvoie la collecte à l'opérateur
   e. Le système notifie l'opérateur

**Flux Alternatifs** :
- 7B. Rejet sans commentaire → Message d'erreur

---

## 4. Diagramme de Séquence - Collecte de Données avec Mode Offline

```
Opérateur     App Mobile    IndexedDB    Queue Manager    API Backend
    │              │             │              │               │
    │─────(1)─────>│             │              │               │
    │ Démarre      │             │              │               │
    │ collecte     │             │              │               │
    │              │             │              │               │
    │              │─────(2)────>│              │               │
    │              │ Load draft  │              │               │
    │              │<────────────┤              │               │
    │              │             │              │               │
    │<─────(3)────┤             │              │               │
    │ Affiche form│             │              │               │
    │              │             │              │               │
    │─────(4)─────>│             │              │               │
    │ Remplit      │             │              │               │
    │ champ        │             │              │               │
    │              │             │              │               │
    │              │─────(5)────>│              │               │
    │              │ Auto-save   │              │               │
    │              │             │              │               │
    │─────(6)─────>│             │              │               │
    │ Prend photo  │             │              │               │
    │              │             │              │               │
    │              │─────(7)────>│              │               │
    │              │ Save photo  │              │               │
    │              │             │              │               │
    │─────(8)─────>│             │              │               │
    │ Soumet       │             │              │               │
    │              │             │              │               │
    │              │─(9) Check connectivity─>   │               │
    │              │             │              │               │
    │              │<────(10)────┤              │               │
    │              │ OFFLINE     │              │               │
    │              │             │              │               │
    │              │─────(11)───────────────────>│               │
    │              │ Add to queue                │               │
    │              │                              │               │
    │<────(12)────┤                              │               │
    │ "Sauvegardé │                              │               │
    │  pour sync" │                              │               │
    │              │                              │               │
    │              │                              │               │
    │   ════════ RETOUR CONNEXION ════════       │               │
    │              │                              │               │
    │              │<────(13)────────────────────┤               │
    │              │ Connectivity restored        │               │
    │              │                              │               │
    │              │─────(14)────────────────────>│               │
    │              │ Process queue                │               │
    │              │                              │               │
    │              │                              │───────(15)───>│
    │              │                              │ POST /data-   │
    │              │                              │ collection    │
    │              │                              │               │
    │              │                              │<──────(16)───┤
    │              │                              │ Success       │
    │              │                              │               │
    │              │<────(17)────────────────────┤               │
    │              │ Item synced                  │               │
    │              │                              │               │
    │              │─────(18)───>│                │               │
    │              │ Clear cache │                │               │
    │              │             │                │               │
    │<────(19)────┤             │                │               │
    │ "Synchronisé"│             │                │               │
    │              │             │                │               │
```

---

## 5. Cas d'Utilisation - Dashboard et KPI

```
                    ┌────────────────────────────────────────┐
                    │    TOUS LES UTILISATEURS               │
                    └──────────────┬─────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        │                          │                          │
   ┌────▼─────┐              ┌────▼─────┐              ┌────▼─────┐
   │ Consulter│              │ Consulter│              │ Générer  │
   │Dashboard │              │   KPI    │              │ Rapports │
   └────┬─────┘              └────┬─────┘              └────┬─────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │ Filtrer  │              │ Filtrer  │              │ Choisir  │
   │  Période │              │ Période  │              │  Type    │
   │          │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
        │                          │                          │
   ┌────┴─────┐              ┌────┴─────┐              ┌────┴─────┐
   │          │              │          │              │          │
   │ Exporter │              │ Comparer │              │ Filtrer  │
   │  Données │              │ Périodes │              │  Données │
   │          │              │          │              │          │
   └──────────┘              └──────────┘              └──────────┘
                                   │                          │
                             ┌────┴─────┐              ┌────┴─────┐
                             │          │              │          │
                             │ Drill    │              │ Exporter │
                             │  Down    │              │ PDF/Excel│
                             │          │              │          │
                             └──────────┘              └──────────┘
```

### Détail des Cas d'Utilisation - Dashboard

#### UC-30: Consulter le Dashboard
**Acteur** : Tous les utilisateurs connectés  
**Préconditions** : 
- L'utilisateur est connecté
- Au moins un dashboard existe et est accessible

**Flux Principal** :
1. L'utilisateur accède à la page dashboard
2. Le système charge le dashboard par défaut ou le dernier consulté
3. Le système affiche les widgets configurés :
   - KPI Cards (valeurs principales)
   - Graphiques (évolution, comparaison)
   - Tableaux (données détaillées)
   - Jauges (objectifs)
4. L'utilisateur peut :
   - Filtrer par période
   - Filtrer par département
   - Filtrer par catégorie
5. Les widgets se mettent à jour automatiquement
6. L'utilisateur peut exporter les données

**Flux Alternatifs** :
- 2a. Pas de dashboard → Proposition de créer un dashboard (si permissions)

---

## 6. Matrice des Permissions

```
┌─────────────────────────────────────────────────────────────────────┐
│                      MATRICE DES PERMISSIONS                         │
├─────────────────────┬──────────┬────────────┬──────────┬───────────┤
│ Fonctionnalité      │  Admin   │ Superviseur│ Opérateur│Visualiseur│
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ Gestion Utilisateurs│          │            │          │           │
│  - Créer            │    ✓     │     -      │    -     │     -     │
│  - Modifier         │    ✓     │     -      │    -     │     -     │
│  - Supprimer        │    ✓     │     -      │    -     │     -     │
│  - Consulter        │    ✓     │     ✓      │    -     │     -     │
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ Gestion Rôles       │          │            │          │           │
│  - Créer            │    ✓     │     -      │    -     │     -     │
│  - Modifier         │    ✓     │     -      │    -     │     -     │
│  - Attribuer        │    ✓     │     -      │    -     │     -     │
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ Gestion Checklists  │          │            │          │           │
│  - Créer            │    ✓     │     -      │    -     │     -     │
│  - Modifier         │    ✓     │     -      │    -     │     -     │
│  - Publier          │    ✓     │     -      │    -     │     -     │
│  - Archiver         │    ✓     │     -      │    -     │     -     │
│  - Consulter        │    ✓     │     ✓      │    ✓     │     ✓     │
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ Gestion Attributions│          │            │          │           │
│  - Créer            │    ✓     │     ✓      │    -     │     -     │
│  - Modifier         │    ✓     │     ✓      │    -     │     -     │
│  - Annuler          │    ✓     │     ✓      │    -     │     -     │
│  - Consulter        │    ✓     │     ✓      │    ✓     │     -     │
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ Collecte de Données │          │            │          │           │
│  - Créer            │    ✓     │     ✓      │    ✓     │     -     │
│  - Modifier         │    ✓     │     ✓      │    ✓     │     -     │
│  - Soumettre        │    ✓     │     ✓      │    ✓     │     -     │
│  - Consulter        │    ✓     │     ✓      │    ✓     │     ✓     │
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ Approbations        │          │            │          │           │
│  - Approuver        │    ✓     │     ✓      │    -     │     -     │
│  - Rejeter          │    ✓     │     ✓      │    -     │     -     │
│  - Consulter        │    ✓     │     ✓      │    ✓     │     ✓     │
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ KPI                 │          │            │          │           │
│  - Définir          │    ✓     │     -      │    -     │     -     │
│  - Configurer       │    ✓     │     -      │    -     │     -     │
│  - Consulter        │    ✓     │     ✓      │    -     │     ✓     │
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ Dashboards          │          │            │          │           │
│  - Créer            │    ✓     │     ✓      │    -     │     -     │
│  - Modifier         │    ✓     │     ✓      │    -     │     -     │
│  - Partager         │    ✓     │     ✓      │    -     │     -     │
│  - Consulter        │    ✓     │     ✓      │    -     │     ✓     │
├─────────────────────┼──────────┼────────────┼──────────┼───────────┤
│ Rapports            │          │            │          │           │
│  - Créer            │    ✓     │     ✓      │    -     │     -     │
│  - Exporter         │    ✓     │     ✓      │    -     │     ✓     │
│  - Consulter        │    ✓     │     ✓      │    -     │     ✓     │
└─────────────────────┴──────────┴────────────┴──────────┴───────────┘
```

---

## 7. Flux Métier Complets

### Flux 1: De la Création de Checklist à la Collecte

```
1. ADMINISTRATEUR
   ├─> Crée une checklist avec le builder
   ├─> Définit les sections et champs
   ├─> Configure les validations
   └─> Publie la checklist
       │
2. ADMINISTRATEUR / SUPERVISEUR       
   ├─> Crée une attribution
   ├─> Sélectionne la checklist
   ├─> Assigne à un ou plusieurs opérateurs
   ├─> Définit échéance et priorité
   └─> Valide l'attribution
       │
       ├─> SYSTÈME envoie notification
       │
3. OPÉRATEUR
   ├─> Reçoit notification
   ├─> Ouvre l'application
   ├─> Consulte ses tâches
   ├─> Sélectionne la tâche
   └─> Commence la collecte
       ├─> Remplit les champs
       ├─> Prend des photos
       ├─> Capture signature
       ├─> Sauvegarde (auto ou manuelle)
       └─> Soumet la collecte
           │
4. SYSTÈME
   ├─> Valide la complétude
   ├─> Change statut assignment → "completed"
   └─> Crée une demande d'approbation (si workflow configuré)
       │
5. SUPERVISEUR
   ├─> Reçoit notification
   ├─> Consulte la collecte
   ├─> Examine les données
   └─> Décision:
       ├─> APPROUVE → Collecte validée, données disponibles pour KPI
       ├─> REJETTE → Collecte rejetée, notification à l'opérateur
       └─> DEMANDE CORRECTION → Retour à l'opérateur
```

### Flux 2: Calcul et Affichage de KPI

```
1. ADMINISTRATEUR
   ├─> Définit un KPI
   ├─> Configure:
   │   ├─> Nom et description
   │   ├─> Type de calcul (count, sum, avg, custom)
   │   ├─> Source de données (collections, champs spécifiques)
   │   ├─> Fréquence de calcul
   │   └─> Objectif / Seuils
   └─> Active le KPI
       │
2. SYSTÈME (Scheduler)
   ├─> Déclenche le calcul selon la fréquence
   ├─> Récupère les données
   ├─> Applique la formule de calcul
   ├─> Sauvegarde la valeur avec timestamp
   └─> Vérifie les seuils
       └─> Si seuil franchi → Génère alerte
           │
3. UTILISATEUR
   ├─> Accède au dashboard
   ├─> Système affiche les KPI
   │   ├─> Valeur actuelle
   │   ├─> Objectif
   │   ├─> Tendance
   │   └─> Graphique évolution
   ├─> Utilisateur peut filtrer par période
   └─> Utilisateur peut exporter les données
```

---

## 8. Scénarios d'Exception

### Scénario 1: Perte de connexion pendant la collecte

```
SITUATION: Un opérateur remplit une checklist et perd la connexion

1. Opérateur remplit des champs → Sauvegarde auto locale
2. Connexion perdue → Application détecte
3. Indicateur "Mode Offline" affiché
4. Opérateur continue à remplir → Tout sauvegardé localement
5. Opérateur soumet → Données mises en queue
6. Connexion rétablie → Sync automatique
7. Données envoyées au serveur
8. Confirmation de réception
9. Nettoyage du cache local

RÉSULTAT: Aucune donnée perdue, expérience fluide
```

### Scénario 2: Conflit de synchronisation

```
SITUATION: Un opérateur modifie une collecte offline qui a été modifiée par un admin

1. Opérateur modifie collecte offline
2. Admin modifie la même collecte online
3. Opérateur revient online
4. Sync démarre
5. Système détecte conflit (versions différentes)
6. Système met en pause le sync de cet item
7. Système notifie l'opérateur
8. Opérateur ouvre l'écran de résolution:
   ├─> Voir version locale
   ├─> Voir version serveur
   └─> Choisir:
       ├─> Garder version locale
       ├─> Garder version serveur
       └─> Fusionner manuellement
9. Opérateur valide sa décision
10. Système applique la résolution
11. Sync reprend

RÉSULTAT: Conflit résolu, cohérence des données
```

### Scénario 3: Expiration du token pendant l'utilisation

```
SITUATION: L'access token expire pendant qu'un admin consulte le dashboard

1. Admin consulte dashboard
2. Access token expire (15 min)
3. Admin clique sur un filtre → Requête API
4. Serveur retourne 401 Unauthorized
5. Interceptor détecte le 401
6. Interceptor tente refresh token automatiquement
7A. Si refresh réussit:
    ├─> Nouveaux tokens stockés
    ├─> Requête initiale ré-essayée
    └─> Dashboard se met à jour
7B. Si refresh échoue:
    ├─> Utilisateur déconnecté
    ├─> Redirection vers login
    └─> Message: "Session expirée, veuillez vous reconnecter"

RÉSULTAT: Expérience transparente (7A) ou déconnexion propre (7B)
```

## Résumé des Cas d'Utilisation

### Par Acteur

**Administrateur** : 15+ cas d'utilisation
- Gestion complète du système
- Configuration des checklists
- Gestion des utilisateurs et rôles
- Attribution et approbation
- Dashboards et KPI

**Superviseur** : 8+ cas d'utilisation
- Gestion d'équipe
- Attribution de tâches
- Approbation de collectes
- Consultation de dashboards
- Génération de rapports

**Opérateur** : 6+ cas d'utilisation
- Consultation de tâches
- Collecte de données
- Travail offline
- Synchronisation
- Gestion de profil

**Visualiseur** : 3 cas d'utilisation
- Consultation de dashboards
- Consultation de KPI
- Génération de rapports (lecture seule)

---

## Conclusion

Ces cas d'utilisation couvrent l'ensemble des fonctionnalités de la plateforme de digitalisation d'usine. Chaque acteur a des responsabilités claires et des permissions adaptées à son rôle. Le système est conçu pour être :

- **Flexible** : Support de différents types de checklists et workflows
- **Robuste** : Gestion du mode offline et des conflits
- **Sécurisé** : Permissions granulaires et authentification forte
- **Performant** : Calculs automatiques de KPI et dashboards temps réel
- **Traçable** : Audit complet de toutes les actions
