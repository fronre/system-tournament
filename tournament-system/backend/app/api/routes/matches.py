from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database.database import get_db
from app.infrastructure.database.models import MatchModel
from app.domain.entities.match import Match, MatchCreate, MatchWinner
from app.usecases.create_match import create_match

router = APIRouter()


@router.post("/", response_model=Match, summary="Create a new match")
def add_match(match: MatchCreate, db: Session = Depends(get_db)):
    return create_match(db, match)


@router.get("/", response_model=List[Match], summary="Get all matches")
def get_matches(db: Session = Depends(get_db)):
    matches = db.query(MatchModel).all()
    return [
        Match(
            id=m.id,
            team1_id=m.team1_id,
            team2_id=m.team2_id,
            winner_id=m.winner_id,
            round=m.round,
            tournament_id=m.tournament_id
        )
        for m in matches
    ]


@router.get("/tournament/{tournament_id}", response_model=List[Match])
def get_matches_by_tournament(tournament_id: int, db: Session = Depends(get_db)):
    matches = db.query(MatchModel).filter(MatchModel.tournament_id == tournament_id).all()
    return [
        Match(id=m.id, team1_id=m.team1_id, team2_id=m.team2_id,
              winner_id=m.winner_id, round=m.round, tournament_id=m.tournament_id)
        for m in matches
    ]


@router.patch("/{match_id}/winner", summary="Set match winner")
def set_winner(match_id: int, data: MatchWinner, db: Session = Depends(get_db)):
    match = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    match.winner_id = data.winner_id
    db.commit()
    return {"message": "Winner set successfully", "match_id": match_id, "winner_id": data.winner_id}
