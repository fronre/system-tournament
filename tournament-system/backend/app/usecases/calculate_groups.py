import random
import math
from sqlalchemy.orm import Session
from app.infrastructure.database.models import PlayerModel


def calculate_groups(db: Session, group_size: int = 4) -> list:
    players = db.query(PlayerModel).all()
    if not players:
        return []

    shuffled = list(players)
    random.shuffle(shuffled)

    num_groups = math.ceil(len(shuffled) / group_size)
    groups = []

    for i in range(num_groups):
        group_players = shuffled[i * group_size: (i + 1) * group_size]
        # Generate round-robin matches within group
        matches = []
        for j in range(len(group_players)):
            for k in range(j + 1, len(group_players)):
                matches.append({
                    "player1": group_players[j].name,
                    "player2": group_players[k].name,
                    "result": None  # None | "player1" | "draw" | "player2"
                })

        groups.append({
            "group": i + 1,
            "name": f"المجموعة {i + 1}",
            "players": [
                {"id": p.id, "name": p.name, "points": 0, "wins": 0, "draws": 0, "losses": 0}
                for p in group_players
            ],
            "matches": matches
        })

    return groups
