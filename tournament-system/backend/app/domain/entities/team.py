from pydantic import BaseModel
from typing import Optional


class Team(BaseModel):
    id: Optional[int] = None
    player1: str
    player2: Optional[str] = None
    player3: Optional[str] = None
    tournament_id: Optional[int] = None

    class Config:
        from_attributes = True


class TeamCreate(BaseModel):
    player1: str
    player2: Optional[str] = None
    player3: Optional[str] = None
    tournament_id: Optional[int] = None
