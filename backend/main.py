import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

from database import init_db
from task_manager import TaskManager
from ws_manager import ws_manager

load_dotenv()

API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not configured")

# Configuration du modèle Claude (configurable via env)
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")
CLAUDE_TIMEOUT = float(os.getenv("CLAUDE_TIMEOUT", "120"))  # 120 seconds default

app = FastAPI(title="Claude Cowork Backend")

# Configuration CORS sécurisée
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,tauri://localhost,http://tauri.localhost").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

task_manager = TaskManager(API_KEY, model=CLAUDE_MODEL, timeout=CLAUDE_TIMEOUT)


class TaskCreate(BaseModel):
    description: str


class TaskResponse(BaseModel):
    id: str
    description: str
    status: str
    result: str | None = None
    error: str | None = None
    created_at: str
    updated_at: str


@app.on_event("startup")
async def startup():
    await init_db()


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/tasks", response_model=TaskResponse)
async def create_task(task: TaskCreate):
    return await task_manager.create_task(task.description)


@app.get("/api/tasks", response_model=list[TaskResponse])
async def get_tasks():
    return await task_manager.get_all_tasks()


@app.get("/api/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    task = await task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error("WebSocket error (details masked for security)")
        ws_manager.disconnect(websocket)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
