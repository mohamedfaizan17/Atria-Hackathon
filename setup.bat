@echo off
echo ========================================
echo  Mastersolis Infotech - Setup Script
echo ========================================
echo.

REM Check if .env exists
if exist backend\.env (
    echo [OK] backend/.env already exists
) else (
    echo [CREATING] backend/.env file...
    copy backend\.env.example backend\.env
    echo.
    echo ============================================
    echo  IMPORTANT: Configure your .env file!
    echo ============================================
    echo.
    echo Open: backend/.env
    echo.
    echo Then add your Gemini API Key:
    echo   1. Get free key: https://makersuite.google.com/app/apikey
    echo   2. Paste in GEMINI_API_KEY=your-key-here
    echo.
    pause
)

echo.
echo ========================================
echo  Installing Dependencies...
echo ========================================
echo.

echo [1/2] Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo [ERROR] Backend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/2] Installing Frontend Dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo [ERROR] Frontend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo   1. Configure backend/.env with your Gemini API key
echo   2. Run: start-servers.bat
echo.
pause
