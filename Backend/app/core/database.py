from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# 1️⃣ Create engine
engine = create_async_engine(
    settings.database_url,
    echo=False,
    future=True,
)

# 2️⃣ Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 3️⃣ Base class
class Base(DeclarativeBase):
    pass

# 4️⃣ Database initialization function
async def init_db():
    """Create all tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
