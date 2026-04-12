import uuid
import asyncio
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from anthropic import Anthropic

from database import Task, TaskStatus, async_session


class TaskManager:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
        self.running_tasks = set()

    async def create_task(self, description: str) -> dict:
        """Create a new task"""
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

            # Launch async execution
            asyncio.create_task(self.execute_task(task_id))

            return self._task_to_dict(task)

    async def execute_task(self, task_id: str):
        """Execute a task with Claude API"""
        async with async_session() as session:
            # Load task
            result = await session.execute(
                select(Task).where(Task.id == task_id)
            )
            task = result.scalar_one()

            if task.status != TaskStatus.PENDING:
                return

            # Mark as running
            task.status = TaskStatus.RUNNING
            task.updated_at = datetime.utcnow()
            await session.commit()

            try:
                # Call Claude API
                message = self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1024,
                    messages=[
                        {
                            "role": "user",
                            "content": task.description
                        }
                    ]
                )

                result_text = message.content[0].text

                # Save result
                task.status = TaskStatus.COMPLETED
                task.result = result_text
                task.updated_at = datetime.utcnow()
                await session.commit()

            except Exception as e:
                task.status = TaskStatus.FAILED
                task.error = str(e)
                task.updated_at = datetime.utcnow()
                await session.commit()

    async def get_task(self, task_id: str) -> dict | None:
        """Get a task by ID"""
        async with async_session() as session:
            result = await session.execute(
                select(Task).where(Task.id == task_id)
            )
            task = result.scalar_one_or_none()
            return self._task_to_dict(task) if task else None

    async def get_all_tasks(self) -> list[dict]:
        """Get all tasks"""
        async with async_session() as session:
            result = await session.execute(select(Task))
            tasks = result.scalars().all()
            return [self._task_to_dict(task) for task in tasks]

    @staticmethod
    def _task_to_dict(task: Task) -> dict:
        """Convert task to dictionary"""
        return {
            "id": task.id,
            "description": task.description,
            "status": task.status.value,
            "result": task.result,
            "error": task.error,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat(),
        }
