# Claude Cowork for Linux — Setup Guide

## Prerequisites

- Node.js 18+
- Python 3.10+
- Rust (for Tauri)
- Anthropic API key

## Quick Setup

### 1. Clone and Configure

```bash
cd cowork-linux
cp .env.example .env
# Edit .env and add your API key
```

### 2. Install Python Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Install React Frontend

```bash
cd ../src-frontend
npm install
```

### 4. Install Tauri (once)

```bash
cd ..
npm install -g @tauri-apps/cli
# Fedora: sudo dnf install libxcb-devel libxkbcommon-devel
```

## Running the App

### Terminal 1: Python Backend

```bash
cd backend
source venv/bin/activate
python main.py
```

Server will run at `http://localhost:8000`

### Terminal 2: React Frontend (Dev Mode)

```bash
cd src-frontend
npm run dev
```

Access the app at `http://localhost:5173`

## Build for Linux (Fedora)

```bash
npm run build
# Generates AppImage and .deb
```

## Project Structure

```
cowork-linux/
├── backend/           # FastAPI + Claude Agent
├── src-frontend/      # React UI
├── src-tauri/         # Tauri Desktop Shell
├── tauri.conf.json    # Tauri Configuration
└── data/              # SQLite Database
```

## How It Works

- Tasks are executed asynchronously in the background
- Results are persisted in SQLite
- Frontend auto-refreshes every 2 seconds
- Each task calls Claude API with the description as prompt
