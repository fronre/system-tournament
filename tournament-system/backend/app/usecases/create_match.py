from sqlalchemy.orm import Session
from app.infrastructure.database.models import MatchModel
from app.domain.entities.match import Match, MatchCreate


def create_match(db: Session, match: MatchCreate) -> Match:
    db_match = MatchModel(**match.model_dump())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return Match(
        id=db_match.id,
        team1_id=db_match.team1_id,
        team2_id=db_match.team2_id,
        winner_id=db_match.winner_id,
        round=db_match.round,
        tournament_id=db_match.tournament_id
    )
