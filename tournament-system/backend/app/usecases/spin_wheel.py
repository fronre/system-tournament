import random
from sqlalchemy.orm import Session
from app.infrastructure.database.models import PlayerModel


def spin_wheel(db: Session) -> dict:
    players = db.query(PlayerModel).all()
    if not players:
        return {"selected": None, "error": "No players available"}
    selected = random.choice(players)
    return {"selected": {"id": selected.id, "name": selected.name}}
