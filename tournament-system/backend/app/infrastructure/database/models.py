from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.infrastructure.database.database import Base


class PlayerModel(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class TournamentModel(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)  # "1v1", "2v2", "3v3", "groups"
    status = Column(String, default="active")  # "active", "completed"


class TeamModel(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    player1 = Column(String, nullable=False)
    player2 = Column(String, nullable=True)
    player3 = Column(String, nullable=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=True)


class MatchModel(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    team1_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    team2_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    winner_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    round = Column(String, nullable=False)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=True)
