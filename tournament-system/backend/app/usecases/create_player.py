from sqlalchemy.orm import Session
from app.infrastructure.database.models import PlayerModel
from app.domain.entities.player import Player, PlayerCreate


def create_player(db: Session, player: PlayerCreate) -> Player:
    db_player = PlayerModel(name=player.name)
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return Player(id=db_player.id, name=db_player.name, created_at=db_player.created_at)
