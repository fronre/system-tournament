from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.database.database import get_db
from app.infrastructure.database.models import PlayerModel
from app.domain.entities.player import Player, PlayerCreate
from app.usecases.create_player import create_player
from app.usecases.delete_player import delete_player

router = APIRouter()


@router.post("/", response_model=Player, summary="Add a new player")
def add_player(player: PlayerCreate, db: Session = Depends(get_db)):
    existing = db.query(PlayerModel).filter(PlayerModel.name == player.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Player already exists")
    return create_player(db, player)


@router.get("/", response_model=List[Player], summary="Get all players")
def get_players(db: Session = Depends(get_db)):
    players = db.query(PlayerModel).order_by(PlayerModel.created_at.desc()).all()
    return [Player(id=p.id, name=p.name, created_at=p.created_at) for p in players]


@router.delete("/{player_id}", summary="Delete a player by ID")
def remove_player(player_id: int, db: Session = Depends(get_db)):
    success = delete_player(db, player_id)
    if not success:
        raise HTTPException(status_code=404, detail="Player not found")
    return {"message": "Player deleted successfully", "id": player_id}
