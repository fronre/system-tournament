from pydantic import BaseModel
from typing import Optional


class Tournament(BaseModel):
    id: Optional[int] = None
    type: str  # "1v1", "2v2", "3v3", "groups"
    status: str = "active"

    class Config:
        from_attributes = True


class TournamentCreate(BaseModel):
    type: str
