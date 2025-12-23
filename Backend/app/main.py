from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.core.database import init_db

app = FastAPI(
    title="Task Management System",
    version="1.0.0",
)

# ✅ CORS CONFIGURATION
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # or ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, PUT, DELETE
    allow_headers=["*"],          # Authorization, Content-Type
)

@app.on_event("startup")
async def on_startup():
    # Create tables if they don't exist
    await init_db()

app.include_router(api_router, prefix="/api/v1")