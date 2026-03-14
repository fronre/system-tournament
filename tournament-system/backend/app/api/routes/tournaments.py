from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database.database import get_db
from app.infrastructure.database.models import TournamentModel, TeamModel, MatchModel
from app.domain.entities.tournament import Tournament, TournamentCreate
from app.usecases.generate_bracket import generate_bracket
from app.usecases.spin_wheel import spin_wheel
from app.usecases.calculate_groups import calculate_groups

router = APIRouter()


@router.post("/create", response_model=Tournament, summary="Create a new tournament")
def create_tournament(tournament: TournamentCreate, db: Session = Depends(get_db)):
    db_tournament = TournamentModel(type=tournament.type, status="active")
    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    return Tournament(id=db_tournament.id, type=db_tournament.type, status=db_tournament.status)


@router.get("/", response_model=List[Tournament], summary="Get all tournaments")
def get_tournaments(db: Session = Depends(get_db)):
    tournaments = db.query(TournamentModel).all()
    return [Tournament(id=t.id, type=t.type, status=t.status) for t in tournaments]


@router.post("/{tournament_id}/bracket", summary="Generate bracket for tournament")
def gen_bracket(tournament_id: int, db: Session = Depends(get_db)):
    return generate_bracket(db, tournament_id)


@router.get("/{tournament_id}/bracket", summary="Get tournament bracket")
def get_bracket(tournament_id: int, db: Session = Depends(get_db)):
    matches = db.query(MatchModel).filter(MatchModel.tournament_id == tournament_id).all()
    teams = db.query(TeamModel).filter(TeamModel.tournament_id == tournament_id).all()
    team_dict = {
        t.id: {"id": t.id, "player1": t.player1, "player2": t.player2, "player3": t.player3}
        for t in teams
    }
    return [
        {
            "id": m.id,
            "team1": team_dict.get(m.team1_id),
            "team2": team_dict.get(m.team2_id),
            "winner_id": m.winner_id,
            "round": m.round
        }
        for m in matches
    ]


@router.patch("/{tournament_id}/complete", summary="Mark tournament as completed")
def complete_tournament(tournament_id: int, db: Session = Depends(get_db)):
    t = db.query(TournamentModel).filter(TournamentModel.id == tournament_id).first()
    if t:
        t.status = "completed"
        db.commit()
    return {"message": "Tournament completed", "id": tournament_id}


@router.get("/spin/wheel", summary="Spin the wheel - random player selection")
def spin(db: Session = Depends(get_db)):
    return spin_wheel(db)


@router.get("/groups/generate", summary="Generate groups from all players")
def groups(group_size: int = 4, db: Session = Depends(get_db)):
    return calculate_groups(db, group_size)
