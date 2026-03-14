from sqlalchemy.orm import Session
from app.infrastructure.database.models import PlayerModel


def delete_player(db: Session, player_id: int) -> bool:
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if not player:
        return False
    db.delete(player)
    db.commit()
    return True
