import asyncio
import threading
from fastapi import APIRouter, status
from sqlalchemy import text
from app.deps.db import DBSession

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", status_code=status.HTTP_200_OK)
async def health_check(db: DBSession):
    thread_id = threading.get_ident()
    task = asyncio.current_task()
    task_id = id(task)

    print(f"START | thread={thread_id} | task={task_id}")

    # DB waits 3 seconds (I/O wait, not blocking event loop)
    result = await db.execute(
        text("SELECT pg_sleep(3), now()")
    )

    print(f"END   | thread={thread_id} | task={task_id}")

    return {
        "status": "ok"
    }