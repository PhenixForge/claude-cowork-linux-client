# Statut du projet — Claude Cowork for Linux

_Dernière mise à jour : 2026-05-10_

---

## Ce qui est fait

### Phase 1 — Core MVP (100% complète)

**Backend (Python / FastAPI)**
- Serveur FastAPI avec CORS configuré pour Tauri + localhost:5173
- 4 endpoints REST : `POST /api/tasks`, `GET /api/tasks`, `GET /api/tasks/{id}`, `GET /health`
- Exécution asynchrone des tâches via l'API Anthropic (claude-3-5-sonnet-20241022)
- Base de données SQLite avec SQLAlchemy (modèles Task, enum TaskStatus)
- Transitions d'état : PENDING → RUNNING → COMPLETED / FAILED

**Frontend (React 18 + TypeScript + Vite)**
- Formulaire de création de tâche avec validation en temps réel (3–5000 caractères)
- Liste des tâches actives (pending, running, failed) avec badges de statut colorés
- Page historique des tâches complétées
- Polling auto toutes les 2 secondes
- Notifications desktop (Web Notifications API)
- Dark mode (préférence système + toggle manuel persisté en localStorage)
- Design responsive
- Client HTTP avec retry + backoff exponentiel
- Sanitisation des inputs HTML

**Tauri (shell desktop Rust)**
- Fenêtre 1200×800 px, redimensionnable
- Cibles de bundle configurées : `.deb`, `.AppImage`
- Content Security Policy en place

---

## Ce qui reste à faire

### Priorité haute

#### Intégration Tauri (Phase 2 — desktop)
- [ ] Lancer le processus Python backend automatiquement depuis Tauri au démarrage
- [ ] Arrêter le backend proprement à la fermeture de l'app
- [ ] Commandes IPC Tauri ↔ Python pour le contrôle du backend
- [ ] Remplacer le polling 2 s par des WebSockets (temps réel, moins de charge)

#### Production & packaging
- [ ] Script de build unifié (frontend + backend + Tauri en une commande)
- [ ] Packaging AppImage fonctionnel (testé et signé)
- [ ] Packaging `.deb` pour Ubuntu/Debian
- [ ] Packaging `.rpm` pour Fedora/RHEL
- [ ] Tests unitaires backend (pytest)
- [ ] Tests E2E frontend (Playwright ou Vitest)

---

### Priorité moyenne

#### Planificateur multi-étapes (Phase 1.5 / Phase 2)
- [ ] Claude décompose une tâche en étapes avant de l'exécuter
- [ ] L'utilisateur peut réviser/valider le plan avant lancement
- [ ] Reprise sur erreur par étape (pas de tout recommencer)

#### Traitement de documents (Phase 2)
- [ ] Extraction de texte depuis PDF
- [ ] Lecture de fichiers Excel/CSV
- [ ] Synthèse de plusieurs documents en une réponse

#### Tâches planifiées (Phase 2)
- [ ] Planification de tâches récurrentes (cron-style)
- [ ] Exécution en arrière-plan sans fenêtre ouverte
- [ ] Historique et logs des exécutions planifiées

---

### Priorité basse (Phases 3–5)

#### Intégrations MCP (Phase 3)
- [ ] Connecteur Notion (lire/écrire des pages)
- [ ] Connecteur Slack (envoyer des messages, lire des canaux)
- [ ] Connecteur Email (IMAP/SMTP)
- [ ] Connecteur Google Drive (lire/écrire des fichiers)

#### Autonomie avancée (Phase 4)
- [ ] Sous-agents parallèles pour les tâches complexes
- [ ] Accès au système de fichiers local (lecture/écriture contrôlée)
- [ ] Browser use (navigation web automatisée)
- [ ] Computer use (contrôle d'interface graphique)

#### UX & polish (Phase 5)
- [ ] Projets / espaces de travail distincts
- [ ] Visualisation de la progression des tâches longues
- [ ] Interface de paramètres (clé API, modèle, limites)
- [ ] Barre de statut système (tray icon Linux)

---

## Limitations actuelles connues

| Limitation | Impact | Résolu en |
|---|---|---|
| Backend lancé manuellement | L'app desktop ne fonctionne pas seule | Phase 2 |
| Polling 2 s au lieu de WebSockets | Latence UI, charge réseau inutile | Phase 2 |
| Pas d'accès au système de fichiers | Claude ne peut pas lire/écrire des fichiers | Phase 4 |
| Pas de planification | Aucune tâche récurrente possible | Phase 2 |
| API Anthropic payante | Coûts variables (~$0.003/1K tokens) | Toujours (by design) |
| Aucun test automatisé | Risque de régression | Phase 3 |

---

## Stack technique

| Couche | Technologie |
|---|---|
| Desktop shell | Tauri 1.x (Rust) |
| Frontend | React 18 + TypeScript + Vite |
| Backend | Python 3.11 + FastAPI + Uvicorn |
| Base de données | SQLite via SQLAlchemy + aiosqlite |
| LLM | Anthropic API (claude-3-5-sonnet-20241022) |
| Packaging Linux | AppImage, .deb, .rpm |
