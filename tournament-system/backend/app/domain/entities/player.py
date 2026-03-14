from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Player(BaseModel):
    id: Optional[int] = None
    name: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PlayerCreate(BaseModel):
    name: str
