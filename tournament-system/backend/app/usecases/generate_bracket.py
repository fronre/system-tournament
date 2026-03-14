import random
from sqlalchemy.orm import Session
from app.infrastructure.database.models import TeamModel, MatchModel


def generate_bracket(db: Session, tournament_id: int) -> list:
    teams = db.query(TeamModel).filter(TeamModel.tournament_id == tournament_id).all()
    if len(teams) < 2:
        return []

    random.shuffle(teams)
    created_matches = []

    for i in range(0, len(teams) - 1, 2):
        match = MatchModel(
            team1_id=teams[i].id,
            team2_id=teams[i + 1].id,
            round="round_1",
            tournament_id=tournament_id
        )
        db.add(match)
        created_matches.append(match)

    db.commit()
    for m in created_matches:
        db.refresh(m)

    return [
        {
            "id": m.id,
            "team1_id": m.team1_id,
            "team2_id": m.team2_id,
            "round": m.round,
            "winner_id": m.winner_id
        }
        for m in created_matches
    ]
