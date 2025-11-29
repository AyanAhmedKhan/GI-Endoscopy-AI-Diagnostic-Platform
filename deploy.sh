#!/bin/bash

# GI Endoscopy AI - Deployment Script
# Usage: ./deploy.sh [production|development]

set -e

ENVIRONMENT=${1:-development}

echo "🚀 Deploying GI Endoscopy AI Diagnostic Portal ($ENVIRONMENT mode)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if model files exist
if [ ! -f "backend/models/deit3_best_traced.pt" ] || [ ! -f "backend/models/vit_best_traced.pt" ]; then
    echo "⚠️  Warning: Model files not found in backend/models/"
    echo "   Please ensure deit3_best_traced.pt and vit_best_traced.pt are present"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/models

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start services
if [ "$ENVIRONMENT" == "production" ]; then
    echo "🏭 Starting in PRODUCTION mode..."
    docker-compose -f docker-compose.prod.yml up -d --build
else
    echo "🔧 Starting in DEVELOPMENT mode..."
    docker-compose up -d --build
fi

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check backend health
echo "🏥 Checking backend health..."
if curl -f http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed, but continuing..."
fi

# Check frontend
echo "🌐 Checking frontend..."
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "⚠️  Frontend check failed, but continuing..."
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📍 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"

