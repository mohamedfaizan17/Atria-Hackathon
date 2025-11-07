@echo off
echo ========================================
echo  Starting Mastersolis Infotech Servers
echo ========================================
echo.

REM Check if .env exists
if not exist backend\.env (
    echo [ERROR] backend/.env not found!
    echo.
    echo Please run setup.bat first or create .env manually:
    echo   1. Copy backend/.env.example to backend/.env
    echo   2. Add your Gemini API key
    echo   3. Get free key: https://makersuite.google.com/app/apikey
    echo.
    pause
    exit /b 1
)

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo  Servers Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
echo Press any key to exit this window...
pause > nul
