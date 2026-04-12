# Claude Cowork for Linux

Desktop application to automate autonomous tasks with Claude AI.

## Architecture

```
cowork-linux/
├── src-tauri/          # Tauri Backend (Rust)
│   └── src/
│       └── main.rs
├── src-frontend/       # React Frontend
│   └── src/
│       ├── App.tsx
│       ├── components/
│       └── pages/
├── backend/            # Python Agent
│   ├── task_manager.py
│   ├── database.py
│   └── main.py
├── data/               # SQLite DB & storage
│   └── cowork.db
└── tauri.conf.json
```

## Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Desktop**: Tauri (Rust) - lightweight for Linux
- **Backend Agent**: Python + FastAPI
- **Database**: SQLite for task history
- **API**: Claude API (Anthropic SDK)

## MVP Features

1. Create/list tasks
2. Autonomous agent to execute them
3. Result history
4. Real-time auto-refresh
