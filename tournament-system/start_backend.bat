@echo off
echo =============================================
echo   Tournament System - Backend Startup
echo =============================================
echo.

cd /d "%~dp0backend"

echo [1] Installing dependencies...
pip install -r requirements.txt

echo.
echo [2] Starting FastAPI server on http://localhost:8000
echo     API Docs: http://localhost:8000/docs
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
