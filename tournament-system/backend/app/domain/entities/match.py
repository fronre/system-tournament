from pydantic import BaseModel
from typing import Optional


class Match(BaseModel):
    id: Optional[int] = None
    team1_id: int
    team2_id: int
    winner_id: Optional[int] = None
    round: str
    tournament_id: Optional[int] = None

    class Config:
        from_attributes = True


class MatchCreate(BaseModel):
    team1_id: int
    team2_id: int
    round: str
    tournament_id: Optional[int] = None


class MatchWinner(BaseModel):
    winner_id: int
