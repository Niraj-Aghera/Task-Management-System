from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: str | None = None


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_completed: bool | None = Field(None, alias="completed")


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    is_completed: bool = Field(..., alias="completed")
    created_at: datetime
    updated_at: datetime | None = None
    user_id: int

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )
