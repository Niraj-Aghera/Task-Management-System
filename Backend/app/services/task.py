from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

class TaskService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_task(self, user_id: int, task: TaskCreate):
        db_task = Task(
            title=task.title,
            description=task.description,
            user_id=user_id
        )
        self.db.add(db_task)
        await self.db.commit()
        await self.db.refresh(db_task)
        return db_task

    async def get_tasks_by_user(self, user_id: int):
        result = await self.db.execute(select(Task).where(Task.user_id == user_id))
        return result.scalars().all()

    async def update_task(self, task_id: int, user_id: int, task: TaskUpdate):
        result = await self.db.execute(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        )
        db_task = result.scalar_one_or_none()
        if not db_task:
            return None
        if task.title is not None:
            db_task.title = task.title
        if task.description is not None:
            db_task.description = task.description
        if task.is_completed is not None:
            db_task.completed = task.is_completed
        await self.db.commit()
        await self.db.refresh(db_task)
        return db_task

    async def delete_task(self, task_id: int, user_id: int):
        result = await self.db.execute(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        )
        db_task = result.scalar_one_or_none()
        if not db_task:
            return False
        await self.db.delete(db_task)
        await self.db.commit()
        return True