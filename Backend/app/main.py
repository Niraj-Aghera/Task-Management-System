from fastapi import FastAPI
from app.api.v1 import api_router
from app.core.database import init_db

app = FastAPI(
    title="Task Management System",
    version="1.0.0",
)

@app.on_event("startup")
async def on_startup():
    # Create tables if they don't exist
    await init_db()

app.include_router(api_router, prefix="/api/v1")