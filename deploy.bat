@echo off
REM GI Endoscopy AI - Deployment Script for Windows
REM Usage: deploy.bat [production|development]

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

echo 🚀 Deploying GI Endoscopy AI Diagnostic Portal (%ENVIRONMENT% mode)

REM Check if Docker is installed
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Check if model files exist
if not exist "backend\models\deit3_best_traced.pt" (
    echo ⚠️  Warning: Model files not found in backend\models\
    echo    Please ensure deit3_best_traced.pt and vit_best_traced.pt are present
    pause
)

if not exist "backend\models\vit_best_traced.pt" (
    echo ⚠️  Warning: Model files not found in backend\models\
    echo    Please ensure deit3_best_traced.pt and vit_best_traced.pt are present
    pause
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "backend\uploads" mkdir backend\uploads
if not exist "backend\models" mkdir backend\models

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose down 2>nul

REM Build and start services
if "%ENVIRONMENT%"=="production" (
    echo 🏭 Starting in PRODUCTION mode...
    docker-compose -f docker-compose.prod.yml up -d --build
) else (
    echo 🔧 Starting in DEVELOPMENT mode...
    docker-compose up -d --build
)

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check backend health
echo 🏥 Checking backend health...
curl -f http://localhost:8000/ >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend is healthy
) else (
    echo ⚠️  Backend health check failed, but continuing...
)

REM Check frontend
echo 🌐 Checking frontend...
curl -f http://localhost:3000/ >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend is accessible
) else (
    echo ⚠️  Frontend check failed, but continuing...
)

echo.
echo 🎉 Deployment complete!
echo.
echo 📍 Access your application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo 📊 View logs: docker-compose logs -f
echo 🛑 Stop services: docker-compose down

pause

