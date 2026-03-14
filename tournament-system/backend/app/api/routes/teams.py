from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database.database import get_db
from app.infrastructure.database.models import TeamModel
from app.domain.entities.team import Team, TeamCreate
from app.usecases.create_team import create_team

router = APIRouter()


@router.post("/", response_model=Team, summary="Create a new team")
def add_team(team: TeamCreate, db: Session = Depends(get_db)):
    return create_team(db, team)


@router.get("/", response_model=List[Team], summary="Get all teams")
def get_teams(db: Session = Depends(get_db)):
    teams = db.query(TeamModel).all()
    return [
        Team(
            id=t.id,
            player1=t.player1,
            player2=t.player2,
            player3=t.player3,
            tournament_id=t.tournament_id
        )
        for t in teams
    ]


@router.get("/tournament/{tournament_id}", response_model=List[Team])
def get_teams_by_tournament(tournament_id: int, db: Session = Depends(get_db)):
    teams = db.query(TeamModel).filter(TeamModel.tournament_id == tournament_id).all()
    return [
        Team(id=t.id, player1=t.player1, player2=t.player2, player3=t.player3, tournament_id=t.tournament_id)
        for t in teams
    ]
