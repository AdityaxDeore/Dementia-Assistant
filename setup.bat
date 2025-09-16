@echo off
REM Clarity Setup Script for Windows
echo 🚀 Setting up Clarity - StudentMindscape Mental Health Platform...

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v18 or higher) and try again.
    pause
    exit /b 1
)

echo ✅ Node.js detected
node -v

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 🔧 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created with default SQLite configuration
) else (
    echo ✅ .env file already exists
)

REM Test TypeScript compilation
echo 🔍 Checking TypeScript compilation...
call npm run check

echo.
echo 🎉 Setup complete! You can now run:
echo.
echo   npm run dev    # Start development server
echo   npm run build  # Build for production
echo   npm start      # Start production server (after build)
echo.
echo The app will be available at http://localhost:5000
echo.
echo 📚 For more information, see README.md
echo.
pause