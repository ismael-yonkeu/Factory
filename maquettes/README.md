# Maquettes HTML/CSS - Système de Digitalisation Maintenance UCB

Ce dossier contient les maquettes HTML/CSS pour illustrer le cahier des charges de digitalisation des checklists de maintenance.

## 📋 Structure des maquettes

### Page d'accueil
- **index.html** : Page d'accueil avec navigation vers toutes les maquettes

### Interfaces principales

1. **dashboard.html** : Dashboard principal
   - Vue d'ensemble des inspections
   - Alertes et notifications
   - Statistiques principales
   - Calendrier des inspections
   - KPIs rapides

2. **checklists.html** : Interface de saisie des checklists
   - Saisie des inspections avec cases OUI/NON
   - Remarques et documents joints
   - Détection automatique des non-conformités
   - Validation par responsable avec signature électronique

3. **equipements.html** : Gestion des équipements
   - Liste des équipements avec filtres
   - Statut des équipements (Actif, En maintenance, Hors service)
   - Historique des inspections par équipement
   - Actions rapides (Checklist, Édition, Historique)

4. **kpi.html** : Tableaux de bord KPIs et Ratios
   - KPIs de sécurité
   - KPIs de performance équipements
   - KPIs de performance opérationnelle
   - Disponibilité par équipement
   - Graphiques d'évolution temporelle

5. **rapports.html** : Génération et historique des rapports
   - Rapports hebdomadaires
   - Rapports mensuels
   - Rapports personnalisés avec filtres
   - Historique des rapports générés
   - Export PDF/Excel

6. **wtp.html** : Interface Water Treatment Plant (WTP)
   - Checklists WTP par fréquence
   - Rapport de production par shift
   - Paramètres physico-chimiques
   - Production forages
   - Consommations (CO2, NaOH, KMnO4, EPIGUARD, Lime milk)

## 🎨 Design System

### Couleurs principales
- **Primary** : #2563eb (Bleu)
- **Secondary** : #10b981 (Vert)
- **Success** : #10b981
- **Warning** : #f59e0b (Orange)
- **Danger** : #ef4444 (Rouge)

### Composants
- Cards (cartes)
- Tables (tableaux)
- Forms (formulaires)
- Buttons (boutons)
- Badges (badges de statut)
- Alerts (alertes)
- Stats cards (cartes de statistiques)
- Progress bars (barres de progression)

## 🚀 Utilisation

### Ouvrir les maquettes

1. Ouvrez le fichier `index.html` dans un navigateur web
2. Cliquez sur une carte pour accéder à la maquette correspondante
3. Utilisez le bouton "← Retour" pour revenir à la page d'accueil

### Aperçu local

Vous pouvez simplement ouvrir le fichier `index.html` directement dans votre navigateur. Tous les fichiers CSS et liens sont relatifs, donc ils fonctionnent sans serveur web.

### Hébergement

Pour un meilleur affichage et pour tester les fonctionnalités interactives, vous pouvez :
- Utiliser un serveur local (ex: `python -m http.server` dans le dossier maquettes)
- Héberger sur un serveur web (Apache, Nginx, etc.)

## 📱 Responsive Design

Les maquettes sont conçues pour être responsive :
- **Desktop** : Affichage optimal sur écrans larges
- **Tablette** : Adaptation automatique pour tablettes
- **Mobile** : Version optimisée pour smartphones

## 🎯 Fonctionnalités illustrées

### Dashboard
- ✅ Alertes en temps réel
- ✅ Statistiques principales
- ✅ Inspections à venir
- ✅ Calendrier des inspections
- ✅ KPIs rapides

### Checklists
- ✅ Saisie des tâches avec cases OUI/NON
- ✅ Remarques par tâche
- ✅ Détection des non-conformités
- ✅ Photos/documents joints
- ✅ Validation avec signature électronique

### Équipements
- ✅ Liste complète avec filtres
- ✅ Statut des équipements
- ✅ Dernières inspections
- ✅ Prochaines inspections planifiées

### KPIs
- ✅ KPIs de sécurité (LTI, FAI, Safety Compliance)
- ✅ KPIs de performance équipements (Availability, PM Compliance)
- ✅ KPIs de performance opérationnelle (Ratios, Consommations)
- ✅ Disponibilité par équipement
- ✅ Graphiques d'évolution

### Rapports
- ✅ Génération de rapports hebdomadaires/mensuels
- ✅ Rapports personnalisés avec filtres
- ✅ Export PDF/Excel
- ✅ Historique des rapports

### WTP
- ✅ Checklists WTP par fréquence
- ✅ Rapport de production par shift
- ✅ Paramètres physico-chimiques
- ✅ Production forages
- ✅ Consommations

## 📝 Notes importantes

- Ces maquettes sont statiques et illustrent uniquement l'interface utilisateur
- Les graphiques sont représentés par des placeholders (intégration future d'une bibliothèque de graphiques)
- Les formulaires ne sont pas fonctionnels (pas de soumission réelle)
- Les liens entre pages fonctionnent pour la navigation
- Les données affichées sont des exemples

## 🔄 Améliorations futures

- Intégration de bibliothèques de graphiques (Chart.js, D3.js, etc.)
- Animations et transitions
- Mode sombre
- Internationalisation (i18n)
- Accessibilité (a11y) améliorée

## 📄 Fichiers inclus

- `index.html` - Page d'accueil
- `dashboard.html` - Dashboard principal
- `checklists.html` - Interface de saisie des checklists
- `equipements.html` - Gestion des équipements
- `kpi.html` - Tableaux de bord KPIs
- `rapports.html` - Génération de rapports
- `wtp.html` - Interface WTP
- `styles.css` - Styles CSS communs
- `README.md` - Ce fichier

## 👨‍💻 Contribution

Ces maquettes peuvent être améliorées et adaptées selon les besoins du projet final. N'hésitez pas à modifier les couleurs, les composants ou ajouter de nouvelles fonctionnalités.

---

**Créé pour illustrer le Cahier des Charges - Digitalisation des Checklists de Maintenance UCB**

