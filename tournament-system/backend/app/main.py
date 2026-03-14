from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import APP_NAME, APP_VERSION, CORS_ORIGINS
from app.infrastructure.database.database import create_tables
from app.api.routes import players, teams, matches, tournaments

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Tournament Management System API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    create_tables()


@app.get("/")
def root():
    return {"message": f"{APP_NAME} API is running!", "version": APP_VERSION}


app.include_router(players.router, prefix="/players", tags=["Players"])
app.include_router(teams.router, prefix="/teams", tags=["Teams"])
app.include_router(matches.router, prefix="/matches", tags=["Matches"])
app.include_router(tournaments.router, prefix="/tournament", tags=["Tournaments"])
