from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.deps.db import DBSession
from app.deps.auth import get_current_user
from app.services.task import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate,
    db: DBSession,
    current_user=Depends(get_current_user),
):
    service = TaskService(db)
    return await service.create_task(user_id=current_user.id, task=task)


@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    db: DBSession,
    current_user=Depends(get_current_user),
):
    service = TaskService(db)
    return await service.get_tasks_by_user(user_id=current_user.id)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task: TaskUpdate,
    db: DBSession,
    current_user=Depends(get_current_user),
):
    service = TaskService(db)
    updated_task = await service.update_task(task_id=task_id, user_id=current_user.id, task=task)
    if not updated_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: DBSession,
    current_user=Depends(get_current_user),
):
    service = TaskService(db)
    deleted = await service.delete_task(task_id=task_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")