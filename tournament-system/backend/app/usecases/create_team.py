from sqlalchemy.orm import Session
from app.infrastructure.database.models import TeamModel
from app.domain.entities.team import Team, TeamCreate


def create_team(db: Session, team: TeamCreate) -> Team:
    db_team = TeamModel(**team.model_dump())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return Team(
        id=db_team.id,
        player1=db_team.player1,
        player2=db_team.player2,
        player3=db_team.player3,
        tournament_id=db_team.tournament_id
    )
