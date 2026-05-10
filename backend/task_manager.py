import uuid
import asyncio
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from anthropic import AsyncAnthropic

from database import Task, TaskStatus, async_session
from ws_manager import ws_manager


class TaskManager:
    def __init__(self, api_key: str):
        self.client = AsyncAnthropic(api_key=api_key)

    async def create_task(self, description: str) -> dict:
        task_id = str(uuid.uuid4())

        async with async_session() as session:
            task = Task(
                id=task_id,
                description=description,
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
                message = await self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1024,
                    messages=[{"role": "user", "content": task.description}]
                )

                task.status = TaskStatus.COMPLETED
                task.result = message.content[0].text
                task.updated_at = datetime.utcnow()
                await session.commit()
                await ws_manager.broadcast(self._task_to_dict(task))

            except Exception as e:
                task.status = TaskStatus.FAILED
                task.error = str(e)
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
