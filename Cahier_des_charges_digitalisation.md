# CAHIER DES CHARGES - DIGITALISATION DES CHECKLISTS DE MAINTENANCE

## 1. CONTEXTE ET OBJECTIFS

### 1.1 Contexte
La société UCB utilise actuellement des fichiers Excel pour gérer les checklists de maintenance préventive de ses équipements industriels. Ces fichiers Excel sont utilisés pour :
- Les inspections quotidiennes (Daily)
- Les inspections hebdomadaires (Weekly)
- Les inspections mensuelles (Monthly)
- Les inspections trimestrielles, semestrielles et bimensuelles
- Le suivi des équipements électriques et mécaniques
- Le suivi des équipements utilitaires (compresseurs, chaudières, etc.)

### 1.2 Problématiques identifiées
- **Multiplicité des fichiers** : Plus de 20 fichiers Excel distincts pour différentes lignes et fréquences
- **Traçabilité limitée** : Difficulté à suivre l'historique des inspections
- **Risques d'erreurs** : Saisie manuelle, risques de perte de données
- **Consolidation difficile** : Analyse et reporting complexes, notamment pour les KPIs
- **Calculs manuels** : Ratios et indicateurs de performance calculés manuellement avec risques d'erreurs
- **Reporting fragmenté** : Tableaux de bord KPI séparés des checklists, difficulté de consolidation
- **Accessibilité** : Fichiers locaux, partage difficile
- **Versioning** : Gestion des versions complexe
- **Suivi des objectifs** : Comparaison Target vs Actual nécessitant des calculs manuels

### 1.3 Objectifs de la digitalisation
- **Centralisation** : Un système unique pour toutes les checklists
- **Traçabilité** : Historique complet des inspections et interventions
- **Automatisation** : Génération automatique des checklists selon les fréquences
- **Reporting** : Tableaux de bord et rapports automatisés
- **Accessibilité** : Accès via interface web/mobile
- **Alertes** : Notifications automatiques pour les tâches à réaliser
- **Validation** : Signatures électroniques pour intervenants et responsables

## 2. ANALYSE DES FICHIERS EXCEL EXISTANTS

### 2.1 Structure générale identifiée

Tous les fichiers Excel analysés suivent une structure similaire avec :

#### 2.1.1 Colonnes standard
1. **N°** : Numéro de la tâche
2. **DESCRIPTION DES TACHES** : Description détaillée de la tâche de maintenance
3. **Durée** : Temps estimé (en minutes)
4. **OUI** : Case à cocher pour validation positive
5. **NON** : Case à cocher pour non-conformité
6. **REMARQUES (MATERIEL + PIECES)** : Champ libre pour observations, matériel utilisé, pièces nécessaires
7. **Date** : Date de réalisation
8. **Nom et Visa Intervenants** : Identification de l'intervenant
9. **Nom et Visa Responsables** : Validation par le responsable

#### 2.1.2 En-têtes et métadonnées
- **Type de checklist** : ELECTRIQUE ou MECANIQUE
- **Équipement** : Nom de l'équipement (ex: Chaine 6, CONVOYEURS CASIERS C1, etc.)
- **Ligne de production** : Identification de la ligne (ex: CHAINE 4, New PET line)
- **Fréquence** : JOURNALIERE, HEBDOMADAIRE, MENSUELLE, TRIMESTRIELLE, etc.

### 2.2 Types de fichiers identifiés

#### 2.2.1 Checklists de maintenance électrique
- **Fréquences** : Quotidienne (Daily), Hebdomadaire (Weekly), Mensuelle (Monthly)
- **Exemples d'équipements** : 
  - Chaine 6 (New PET line)
  - Line 5 Electrical Machine Specialist
  - Line 4 Electrical Machine Specialist

#### 2.2.2 Checklists de maintenance mécanique
- **Fréquences** : Quotidienne, Hebdomadaire, Bimensuelle, Trimestrielle, Semestrielle
- **Exemples d'équipements** :
  - Conveyeurs Casiers (C1 à C8)
  - Palettiseur
  - Labelleur, Kisters, Handle applicator

#### 2.2.3 Checklists d'équipements utilitaires
- **Équipements** :
  - Compresseurs Sabroe
  - Condensateurs
  - Chaudières (Boiler)
  - Compresseurs d'air (90 et 75)
  - Récupération CO2
  - Réservoirs de condensat

#### 2.2.4 Checklists Water Treatment Plant (WTP)
Les fichiers Excel du WTP contiennent des checklists spécialisées pour le traitement de l'eau :

**check-lists WTP.xlsx** (31 feuilles) :
- **Checklists de préparation et service** :
  - Checklist madiba (préparation production Madiba)
  - Checklist prise de Service (06h-14h, 14h-22h)
  - Checklist CIP UF (Recirculation complète UF)
- **Checklists hebdomadaires** :
  - UF_HEB (Ultra Filtration)
  - RO_HEB (Osmose Inverse)
  - Eliwa_HEB
  - WTP_HEB (Water Treatment Plant global)
- **Checklists mensuelles** :
  - UF_MENS, RO_MENS, ELIWA_MENS, WP_MENS
- **Checklists trimestrielles** :
  - UF_TRIM, RO_TRIM, ELIWA_TRIM, WP_TRIM
- **Checklists annuelles** :
  - UF_AN, RO_AN, ELIWA_AN, WP_AN
- **Autres équipements** :
  - FORAGES
  - RESERVOIR INCENDIE

**Tâches typiques identifiées** :
- Vérification des vannes (manuelles, pneumatiques, de régulation, d'aération d'air)
- Contrôle des fuites sur flexibles (air, produits chimiques)
- Nettoyage chimique par recirculation
- Vérification du fonctionnement des pompes, agitateurs, manomètres
- Nettoyage et étalonnage des électrodes (pH, ClO2, turbidité, conductivité)
- Contrôle des transmetteurs de pression
- Vérification des raccords d'injection
- Nettoyage des filtres (fine filter, mélangeur statique)
- Vérification des débitmètres
- Vérification du taux de Mn à UFout et dans le Permeate tank
- Purge des circuits (NaOH, CO2, lime water)

#### 2.2.5 Rapports et logs de production WTP
- **PS3-ID15 RAPPORT DE PRODUCTION.xlsx** :
  - **Production de forages** :
    - Début (m3), Fin (m3), Total produit (m3)
  - **Consommations** :
    - CO2, NaOH, KMnO4, EPIGUARD
    - Lime milk
  - **Paramètres physico-chimiques par shift (06h-14h, 14h-22h)** :
    - RAW WATER (eau brute)
    - UF out (sortie Ultra Filtration)
    - PERMEATE WATER (eau perméatée)
    - SERVICE WATER (eau de service)
    - Paramètres mesurés : pH, Alkalinity (mg/l as CaCO3), Conductivité, etc.
    - Check hours (horaires de contrôle : 07H30, 09H30, 11H30, 15H30, etc.)

- **PS3-ID16 RO log sheet for operators - 30.xls** :
  - Log sheet pour opérateurs RO (format .xls ancien)
  - Suivi quotidien des opérations d'osmose inverse

- **PS3-ID17 SYNTHESE DES CONSOMMATIONS.xlsx** (10 feuilles hebdomadaires) :
  - **Structure hebdomadaire** (une feuille par semaine) :
    - Tableau récapitulatif de la production des forages
    - Tableau de la production d'eau hebdomadaire
    - Tableau de la consommation d'eau hebdomadaire
    - Organisation par jours de la semaine (Lundi, Mardi, Mercredi, Jeudi, Vendredi)
    - TOTAL (m3) par semaine
  - **Données de production et consommation** :
    - Production par forage
    - Production d'eau traitée
    - Consommation par secteur/processus
    - Suivi hebdomadaire avec historique

- **Fichiers Word de contrôle** (PS3-ID09 à PS3-ID14) :
  - PS3-ID09 : Contrôle traitement de l'eau brute
  - PS3-ID10 : Contrôle traitement de l'eau
  - PS3-ID11 : Contrôle traitement eau osmose inverse
  - PS3-ID12 : Contrôle traitement eau perméat
  - PS3-ID13 : Contrôle traitement eau filtration
  - PS3-ID14 : Contrôle traitement eau nettoyage des équipements

#### 2.2.6 Tableaux de bord KPI et Ratios de performance
Les fichiers Excel contiennent également des tableaux de bord de suivi de performance :

**Utility-Ratio.xlsx** :
- **Indicateurs de sécurité** :
  - Safety Incidents & Observations (hebdomadaire)
  - First Aid Incidents
  - SIO Closure Rate
  - Lost Time Accident (LTA)
- **Indicateurs de livraison** :
  - Steam produced (tons)
  - Water Generated (m3)
  - CO2 Generated (Kg)
  - Grid Usage (ENEO) (kWh)
  - Diesel Generator Generation (kWh)
  - Site Electrical Energy consumed (kWh)
  - Gas Usage (m3)
- **Ratios de performance** :
  - CO2 Production Ratio (Kg/hr, Target ≥ 400)
  - Steam Fuel Ratio / Boiler Specific Consumption (Kg/M3, Target > 12)
  - Site Energy Usage Ratio (kWh/hl)
  - Site Water Usage Ratio (hl/hl, Target 4.7)
  - Condensate Usage Ratio (%, Target >75%)
  - Generator Efficiency / Specific Diesel Consumption (Ltr/kWh, Target ≤ 0.24)
- **Suivi** : Hebdomadaire avec Target vs Actual par semaine

**UTILITY KPI DASH BOARD FOR EXCELLENCE.xlsx** :
- **Monthly Performance Tracker** :
  - **Sécurité** :
    - LTI (Lost Time Injuries), Target: 0
    - First Aid Injury (FAI), Target: 0
    - Behavioural Safety Compliance (%), Target: 100%
    - Safety Incidence & Observations Identified & Closed (%), Target: > 80%
  - **Performance équipements** :
    - Utility Equipment Availability (%), Target: > 90%
    - Preventive Maintenance Compliance (%), Target: > 90%
  - **Performance opérationnelle** :
    - Diesel Generator Specific Consumption (Ltr/kWhr), Target: ≤ 0.25
    - Steam Fuel Ratio (Kg/LOF), Target: > 12
    - Utility Index (%), Target: > 90%
  - Suivi mensuel (JAN à DEC) avec Target vs Actual
- **Weekly Performance Tracker** :
  - Mean Time to Repair (MTTR), Target: < 0.5 Hrs
  - Mean Time Between Failures (MTBF), Target: > 10 Hrs/13Hrs
  - Maintenance Plan Attainment (MPA), Target: > 95%
  - Preventive Maintenance Compliance, Target: > 90%
- **Rapports de disponibilité** :
  - Par équipement : Air Compressor, Chiller-Sabroe, Boiler, WTP, Diesel Generator, CO2 Plant, Generator Radiator, Condensers + CO2 Cooling Tower
  - Métriques : Uptime/Downtime (Hours/Wk), Number of Failure/Wk, Availability (%), Failure Rate, Breakdown Remarks
  - Disponibilité mensuelle (ex: October 2025, September 2025)
- **KPI Score Card** :
  - Score global consolidé
  - Failure Rate < 1%

### 2.3 Exemples de tâches identifiées

**Maintenance mécanique :**
- "Contrôler l'arrêt d'huile et le remplacer au besoin" (10 min)
- "Contrôler la fixation du réducteur sur le convoyeur" (30 min)
- "Contrôler l'usure du pignon et le remplacer au besoin" (30 min)

**Maintenance électrique :**
- "Effectuer le test de lampes"
- "Contrôler la fonction des dispositifs"
- "Nettoyer les barrières photoélectriques"
- "Vérifier l'absence de dommages"
- "Vérifier l'usure du couteau"

## 3. FONCTIONNALITÉS REQUISES

### 3.1 Gestion des équipements
- **Création et édition** d'équipements avec :
  - Identifiant unique
  - Nom/Description
  - Type (Électrique, Mécanique, Utilitaire, WTP)
  - Ligne de production associée
  - Statut (Actif, Inactif, En maintenance)
  - Localisation
  - **Équipements WTP** :
    - Ultra Filtration (UF)
    - Osmose Inverse (RO)
    - Eliwa
    - Forages
    - Réservoirs (Permeate tank, RO_Cleaning Tank, Lime milk tank, etc.)
    - Pompes (NaOH, lime water, etc.)
    - Électrodes (pH, ClO2, turbidité, conductivité)

### 3.2 Gestion des checklists
- **Création de templates de checklists** :
  - Définition des tâches avec description, durée estimée
  - Association équipement ↔ checklist
  - Définition des fréquences (quotidienne, hebdomadaire, etc.)
  - Hiérarchie des checklists (électrique, mécanique, utilitaire)

- **Génération automatique des checklists** :
  - Création automatique selon la fréquence définie
  - Rappel/notification avant échéance
  - Génération sur demande

### 3.3 Exécution des inspections
- **Interface de saisie** :
  - Affichage de la liste des tâches
  - Cases à cocher OUI/NON
  - Champ de remarques pour chaque tâche
  - Saisie de la durée réelle
  - Ajout de photos/documents joints
  - Signature électronique de l'intervenant
  - **Pour les inspections WTP** :
    - Saisie des paramètres physico-chimiques (pH, conductivité, turbidité, alkalinity, etc.)
    - Enregistrement des valeurs mesurées (début, fin, total produit en m3)
    - Saisie par shift (06h-14h, 14h-22h) avec horaires de contrôle
    - Enregistrement des consommations (CO2, NaOH, KMnO4, EPIGUARD, Lime milk)
    - Suivi des points de contrôle (RAW WATER, UF out, PERMEATE WATER, SERVICE WATER)

- **Validation** :
  - Validation par le responsable avec signature électronique
  - Workflow d'approbation pour les non-conformités
  - Blocage des modifications après validation

### 3.4 Gestion des non-conformités
- **Détection automatique** : Tâche cochée "NON"
- **Création d'un ticket d'anomalie** :
  - Description de l'anomalie
  - Niveau de criticité (Faible, Moyen, Élevé, Critique)
  - Statut (Ouvert, En cours, Résolu, Clos)
  - Assignation à un technicien
  - Dates (détection, résolution prévue, résolution effective)

- **Suivi** :
  - Liste des anomalies ouvertes
  - Historique des résolutions
  - Statistiques par équipement, type, criticité

### 3.5 Historique et traçabilité
- **Consultation** :
  - Historique complet de toutes les inspections par équipement
  - Filtres par date, équipement, intervenant, statut
  - Export PDF/Excel pour archivage
  - **Pour WTP** :
    - Historique des rapports de production par shift et par semaine
    - Historique des synthèses de consommations hebdomadaires
    - Suivi des paramètres physico-chimiques dans le temps
    - Comparaison des valeurs par période (semaine, mois)
    - Log des opérations RO par jour

- **Audit trail** :
  - Log de toutes les actions (création, modification, validation)
  - Horodatage précis
  - Identification des utilisateurs

### 3.6 Reporting et tableaux de bord
- **KPIs de maintenance** :
  - Taux de réalisation des inspections (par équipement, ligne, période)
  - Taux de conformité (nombre de OUI vs NON)
  - Nombre de non-conformités par type et par équipement
  - Temps moyen d'exécution vs temps estimé
  - Taux de résolution des anomalies
  - Mean Time to Repair (MTTR)
  - Mean Time Between Failures (MTBF)
  - Maintenance Plan Attainment (MPA)
  - Preventive Maintenance Compliance

- **KPIs de performance équipements** :
  - Utility Equipment Availability (%)
  - Breakdown (Hours) par équipement
  - Failure Rate par équipement
  - Uptime/Downtime (Hours/Wk)
  - Number of Failure/Wk
  - KPI Score Card consolidé

- **KPIs de sécurité** :
  - LTI (Lost Time Injuries)
  - First Aid Injury (FAI)
  - Behavioural Safety Compliance (%)
  - Safety Incidence & Observations Identified & Closed (%, Target > 80%)
  - SIO Closure Rate

- **KPIs de performance opérationnelle** :
  - **Production** :
    - Steam produced (tons)
    - Water Generated (m3)
    - CO2 Generated (Kg)
    - **Production WTP** :
      - Production des forages (m3/jour, m3/semaine)
      - Production d'eau traitée (m3)
      - Production par type (RAW WATER, UF out, PERMEATE WATER, SERVICE WATER)
  - **Consommation énergétique** :
    - Grid Usage (ENEO) (kWh)
    - Diesel Generator Generation (kWh)
    - Site Electrical Energy consumed (kWh)
    - Gas Usage (m3)
    - **Consommation WTP** :
      - Consommation d'eau (m3/jour, m3/semaine)
      - Consommation de produits chimiques (CO2, NaOH, KMnO4, EPIGUARD, Lime milk)
      - Ratios de consommation (m3 produit / m3 consommé)
  - **Ratios de performance** :
    - CO2 Production Ratio (Kg/hr, Target ≥ 400)
    - Steam Fuel Ratio / Boiler Specific Consumption (Kg/M3, Target > 12)
    - Site Energy Usage Ratio (kWh/hl)
    - Site Water Usage Ratio (hl/hl, Target 4.7)
    - Condensate Usage Ratio (%, Target >75%)
    - Generator Efficiency / Specific Diesel Consumption (Ltr/kWh, Target ≤ 0.24)
    - Utility Index (%, Target > 90%)
    - **Ratios WTP** :
      - Rendement de production (Production / Consommation)
      - Efficacité de traitement par étape (UF, RO, Eliwa)

- **Rapports prédéfinis** :
  - **Hebdomadaire** :
    - Weekly Performance Tracker (MTTR, MTBF, MPA, PM Compliance)
    - Utility Performance Ratio Dashboard (Safety, Delivery, Ratios)
    - Disponibilité des équipements par semaine
    - **Rapports WTP** :
      - Synthèse des consommations hebdomadaire
      - Rapport de production par semaine
      - Production et consommation d'eau par jour de la semaine
      - Tableau récapitulatif de la production des forages (hebdomadaire)
  - **Quotidien** :
    - **Rapports WTP** :
      - Rapport de production par shift (06h-14h, 14h-22h)
      - RO log sheet pour opérateurs
      - Paramètres physico-chimiques par horaire (07H30, 09H30, 11H30, 15H30, etc.)
  - **Mensuel** :
    - Monthly Performance Tracker (tous les KPIs mensuels)
    - Rapport de disponibilité par mois
    - Analyse des tendances et comparaison Target vs Actual
  - **Autres** :
    - Liste des inspections en retard
    - Analyse des non-conformités récurrentes
    - Planification des prochaines inspections
    - Breakdown Remarks et historique des pannes

- **Tableaux de bord interactifs** :
  - Vue d'ensemble des équipements (statut, dernières inspections, disponibilité)
  - Calendrier des inspections à venir
  - Alertes et notifications
  - Graphiques de tendances (Target vs Actual)
  - Comparaisons périodiques (semaine/mois/trimestre)
  - Filtres par équipement, ligne, période, type de KPI

### 3.7 Planification et alertes
- **Planification automatique** :
  - Génération des plannings selon les fréquences
  - Optimisation de la charge de travail

- **Notifications** :
  - Alertes avant échéance (configurable : 1 jour, 3 jours, etc.)
  - Alertes en cas d'inspection en retard
  - Alertes pour non-conformité critique
  - Notification aux responsables pour validation

### 3.8 Gestion des utilisateurs et droits d'accès
- **Rôles** :
  - **Administrateur** : Gestion complète du système
  - **Responsable maintenance** : Validation, consultation, reporting
  - **Technicien/Intervenant** : Exécution des inspections, saisie
  - **Consultant** : Consultation et reporting en lecture seule

- **Droits d'accès** :
  - Par ligne de production
  - Par type d'équipement
  - Par fonctionnalité

## 4. CONTRAINTES TECHNIQUES

### 4.1 Architecture recommandée
- **Application web responsive** : Accessible sur PC, tablette, smartphone
- **Interface mobile native** (optionnel) : Pour utilisation sur terrain
- **Base de données** : Relationnelle pour traçabilité et reporting
- **API REST** : Pour intégration future avec autres systèmes (ERP, GMAO)

### 4.2 Intégrations souhaitées
- **Système de gestion documentaire** : Stockage des photos, documents joints
- **Email** : Pour notifications
- **Système de badgeage** (optionnel) : Identification automatique des intervenants
- **Export** : Compatibilité avec Excel pour transition et reporting

### 4.3 Performance et disponibilité
- **Disponibilité** : 99% minimum
- **Temps de réponse** : < 2 secondes pour la plupart des opérations
- **Support multi-utilisateurs** : 50+ utilisateurs simultanés
- **Sauvegarde** : Quotidienne avec rétention 1 an minimum

### 4.4 Sécurité
- **Authentification** : Système sécurisé (SSO souhaitable)
- **Chiffrement** : HTTPS obligatoire
- **Signature électronique** : Conforme aux exigences légales
- **Audit** : Logs de sécurité pour conformité

## 5. MIGRATION DES DONNÉES EXISTANTES

### 5.1 Import des checklists
- **Extraction** des templates de checklists depuis les fichiers Excel
- **Correction** et normalisation des données
- **Mapping** équipements ↔ checklists ↔ fréquences

### 5.2 Historique (si disponible)
- **Import** des inspections passées (si formaté et accessible)
- **Archivage** des fichiers Excel originaux

## 6. FORMATION ET ADOPTION

### 6.1 Formation des utilisateurs
- **Formation administrateurs** : 1 journée
- **Formation responsables** : 0.5 journée
- **Formation techniciens** : 0.5 journée
- **Documentation utilisateur** : Guides et tutoriels vidéo

### 6.2 Accompagnement au changement
- **Phase pilote** : Test sur 1-2 équipements pendant 1 mois
- **Support** : Hotline pendant les 3 premiers mois
- **Amélioration continue** : Collecte de retours d'expérience

## 7. CRITÈRES D'ACCEPTATION

### 7.1 Fonctionnels
- [ ] Tous les types de checklists identifiés sont supportés
- [ ] Génération automatique selon fréquences configurées
- [ ] Saisie complète avec validation et signatures
- [ ] Gestion des non-conformités opérationnelle
- [ ] Reporting et tableaux de bord fonctionnels
- [ ] Notifications automatiques actives

### 7.2 Techniques
- [ ] Interface responsive et intuitive
- [ ] Performance acceptable (< 2s)
- [ ] Disponibilité ≥ 99%
- [ ] Sécurité conforme aux exigences
- [ ] Export des données possible

### 7.3 Utilisateurs
- [ ] Formation complétée pour tous les utilisateurs
- [ ] Adoption positive (retours utilisateurs)
- [ ] Réduction du temps de saisie vs Excel
- [ ] Amélioration de la traçabilité

## 8. PLANNING SOUHAITÉ

### Phase 1 : Analyse et conception (4 semaines)
- Validation du cahier des charges
- Conception détaillée de l'application
- Wireframes et maquettes

### Phase 2 : Développement (12-16 semaines)
- Développement des fonctionnalités core
- Tests unitaires et d'intégration

### Phase 3 : Tests et migration (4 semaines)
- Tests utilisateurs
- Migration des données
- Formation

### Phase 4 : Déploiement et support (ongoing)
- Mise en production
- Support et ajustements
- Optimisations

## 9. BUDGET ESTIMATIF

À définir selon :
- Choix technologique (développement sur-mesure vs solution existante)
- Volume de données et utilisateurs
- Niveau d'intégration souhaité
- Maintenance et support

## 10. ANNEXES

### 10.1 Liste des fichiers Excel analysés

#### Checklists de maintenance
- Line 6 Check-lists Daily ELEC.xlsx
- Daily - Mechanical check-lists PROCESS TECHNICIAN.xlsx
- Daily electrical inspection PROCESS TECHNICIAN.xlsx
- Line 6 Méca Daily - bonbon.xlsx
- Line 6 Méca Weekly/Monthly/Quarterly/Semester.xlsx
- Line 6 ELEC Weekly/Monthly.xlsx
- Line 6 Graissage Weekly.xlsx
- 2025- Line 5 Mechanical Machine specialist check-lists.xlsx
- 2025-Line 4 electrical Machine specialists checklists.xlsx
- 2025-Line 5 Electrical Machine Specialist checklists.xlsx
- UCB Utility Equipment Checklist.xlsx
- UTILITIES MAINTENANCE 2025.xlsx

#### Checklists Water Treatment Plant (WTP)
- **check-lists WTP.xlsx** (31 feuilles) :
  - Checklists de préparation (Madiba, Prise de Service, CIP UF)
  - Checklists hebdomadaires (UF, RO, Eliwa, WTP)
  - Checklists mensuelles (UF, RO, Eliwa, WP)
  - Checklists trimestrielles (UF, RO, Eliwa, WP)
  - Checklists annuelles (UF, RO, Eliwa, WP, FORAGES, RESERVOIR INCENDIE)
- **Rapports et logs** :
  - PS3-ID15 RAPPORT DE PRODUCTION.xlsx (rapports de production par shift)
  - PS3-ID16 RO log sheet for operators - 30.xls (log quotidien RO)
  - PS3-ID17 SYNTHESE DES CONSOMMATIONS.xlsx (10 feuilles hebdomadaires)
- **Fichiers Word de contrôle** :
  - PS3-ID09 à PS3-ID14 : Checklists de contrôle traitement d'eau (Brute, Filtration, Osmose Inverse, Perméat, Nettoyage équipements)

#### Tableaux de bord KPI et Ratios
- **Utility-Ratio.xlsx** : Dashboard hebdomadaire de ratios de performance (Safety, Delivery, Ratios opérationnels)
- **UTILITY KPI DASH BOARD FOR EXCELLENCE.xlsx** : 
  - Monthly Performance Tracker (KPIs mensuels)
  - Weekly Performance Tracker (MTTR, MTBF, MPA)
  - Rapports de disponibilité par mois
  - KPI Score Card

#### Présentations
- Maintenance KPI.pptx (fichier PowerPoint de présentation des KPIs - non analysé automatiquement)

#### Autres fichiers similaires
- Plus de 20 fichiers Excel distincts pour différentes lignes, fréquences et équipements

### 10.2 Glossaire
- **Checklist** : Liste de vérification des tâches de maintenance
- **Fréquence** : Périodicité d'exécution (Daily, Weekly, Monthly, etc.)
- **Non-conformité** : Résultat "NON" lors d'une inspection
- **Intervenant** : Technicien exécutant l'inspection
- **Responsable** : Personne validant l'inspection

---

**Document généré le** : [Date]
**Version** : 1.0
**Auteur** : Analyse automatique basée sur les fichiers Excel existants

