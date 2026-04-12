import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from database import init_db
from task_manager import TaskManager

# Load environment variables from .env file
load_dotenv()

# Configuration
API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not configured")

# FastAPI app
app = FastAPI(title="Claude Cowork Backend")

# CORS middleware for Tauri communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "tauri://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Task manager instance
task_manager = TaskManager(API_KEY)


# Pydantic models
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


# Routes
@app.on_event("startup")
async def startup():
    """Initialize database on startup"""
    await init_db()


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/tasks", response_model=TaskResponse)
async def create_task(task: TaskCreate):
    """Create a new task"""
    return await task_manager.create_task(task.description)


@app.get("/api/tasks", response_model=list[TaskResponse])
async def get_tasks():
    """Get all tasks"""
    return await task_manager.get_all_tasks()


@app.get("/api/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """Get a specific task by ID"""
    task = await task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
