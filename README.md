# Projet de Digitalisation de l'Usine

Ce dépôt contient le code source complet pour la plateforme de collecte et gestion des données d'usine.

## Structure du Projet

*   `backend/` : API REST NestJS (Node.js). Gère la logique métier, l'authentification et la base de données.
*   `admin-panel/` : Interface d'administration (React + Vite). Pour la gestion des checklists, utilisateurs et dashboards.
*   `web-client/` : Application Web pour la collecte de données sur le terrain (React + Vite).
*   `mobile-app/` : Application Mobile (Flutter) pour la collecte de données (Placeholder).
*   `docker-compose.yml` : Configuration pour lancer la base de données PostgreSQL.
*   `CONCEPTION.md` : Document détaillé de l'architecture, modélisation des données et diagrammes de séquence.

## Prérequis

*   Node.js (v18+)
*   npm
*   Docker & Docker Compose (pour la base de données)
*   Flutter SDK (pour le mobile)

## Démarrage Rapide

### 1. Base de Données

Lancez PostgreSQL :
```bash
docker-compose up -d
```

### 2. Backend (API)

```bash
cd backend
npm install
npm run start:dev
```
L'API sera accessible sur `http://localhost:3000`.

### 3. Admin Panel

```bash
cd admin-panel
npm install
npm run dev
```
L'interface admin sera accessible sur `http://localhost:5173` (ou port indiqué).

### 4. Web Client

```bash
cd web-client
npm install
npm run dev
```
L'interface web terrain sera accessible sur `http://localhost:5174` (ou port indiqué).

## Documentation

Voir le fichier [CONCEPTION.md](./CONCEPTION.md) pour :
*   Les diagrammes de séquence (Auth AD, Auth JWT).
*   Le modèle de données (User, Checklist, Submission).
*   L'architecture détaillée.
