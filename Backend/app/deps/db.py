from app.core.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator
from typing import Annotated
from fastapi import Depends

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

DBSession = Annotated[AsyncSession, Depends(get_db)]