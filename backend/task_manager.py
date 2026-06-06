import uuid
import asyncio
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from anthropic import AsyncAnthropic

from database import Task, TaskStatus, async_session
from ws_manager import ws_manager


class TaskManager:
    def __init__(self, api_key: str, model: str = "claude-3-5-sonnet-20241022", timeout: float = 120.0):
        self.client = AsyncAnthropic(api_key=api_key)
        self.model = model
        self.timeout = timeout

    async def create_task(self, description: str) -> dict:
        # Validation de la description
        if not description or not isinstance(description, str):
            raise ValueError("Task description is required and must be a string")
        
        # Limite de longueur pour éviter les abus
        max_length = 10000
        if len(description.strip()) > max_length:
            raise ValueError(f"Task description cannot exceed {max_length} characters")
        
        # Validation des caractères (sécurité)
        if not all(c.isprintable() or c.isspace() for c in description):
            raise ValueError("Task description contains invalid characters")
        
        task_id = str(uuid.uuid4())

        async with async_session() as session:
            task = Task(
                id=task_id,
                description=description.strip(),
                status=TaskStatus.PENDING
            )
            session.add(task)
            await session.commit()
            await session.refresh(task)

            asyncio.create_task(self.execute_task(task_id))

            return self._task_to_dict(task)

    async def execute_task(self, task_id: str):
        async with async_session() as session:
            result = await session.execute(
                select(Task).where(Task.id == task_id)
            )
            task = result.scalar_one()

            if task.status != TaskStatus.PENDING:
                return

            task.status = TaskStatus.RUNNING
            task.updated_at = datetime.utcnow()
            await session.commit()
            await ws_manager.broadcast(self._task_to_dict(task))

            try:
                # Utiliser asyncio.wait_for pour ajouter un timeout
                message = await asyncio.wait_for(
                    self.client.messages.create(
                        model=self.model,
                        max_tokens=1024,
                        messages=[{"role": "user", "content": task.description}]
                    ),
                    timeout=self.timeout
                )

                task.status = TaskStatus.COMPLETED
                task.result = message.content[0].text
                task.updated_at = datetime.utcnow()
                await session.commit()
                await ws_manager.broadcast(self._task_to_dict(task))

            except asyncio.TimeoutError:
                task.status = TaskStatus.FAILED
                task.error = "Request timeout: Claude took too long to respond"
                task.updated_at = datetime.utcnow()
                await session.commit()
                await ws_manager.broadcast(self._task_to_dict(task))
            except Exception as e:
                # Masquer les détails sensibles dans l'erreur stockée
                task.status = TaskStatus.FAILED
                task.error = "Task execution failed"
                task.updated_at = datetime.utcnow()
                await session.commit()
                await ws_manager.broadcast(self._task_to_dict(task))

    async def get_task(self, task_id: str) -> dict | None:
        async with async_session() as session:
            result = await session.execute(
                select(Task).where(Task.id == task_id)
            )
            task = result.scalar_one_or_none()
            return self._task_to_dict(task) if task else None

    async def get_all_tasks(self) -> list[dict]:
        async with async_session() as session:
            result = await session.execute(select(Task))
            tasks = result.scalars().all()
            return [self._task_to_dict(task) for task in tasks]

    @staticmethod
    def _task_to_dict(task: Task) -> dict:
        return {
            "id": task.id,
            "description": task.description,
            "status": task.status.value,
            "result": task.result,
            "error": task.error,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat(),
        }
