# 🚀 Quick Deployment Guide

## Option 1: Docker Compose (Easiest)

### Windows:
```bash
# Run deployment script
deploy.bat

# Or manually:
docker-compose up -d --build
```

### Linux/Mac:
```bash
# Run deployment script
chmod +x deploy.sh
./deploy.sh

# Or manually:
docker-compose up -d --build
```

### Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Option 2: Manual Docker

### Backend:
```bash
cd backend
docker build -t gi-endoscopy-backend .
docker run -p 8000:8000 -v $(pwd)/models:/app/models gi-endoscopy-backend
```

### Frontend:
```bash
cd frontend
docker build -t gi-endoscopy-frontend --build-arg REACT_APP_API_URL=http://localhost:8000 .
docker run -p 3000:80 gi-endoscopy-frontend
```

---

## Option 3: Cloud Platforms

### Railway.app (Recommended for beginners)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add two services:
   - Backend: Root = `backend/`, Command = `uvicorn app_gradcam:app --host 0.0.0.0 --port $PORT`
   - Frontend: Root = `frontend/`, Build = `npm install && npm run build`, Start = `npx serve -s build -l $PORT`

### Render.com
1. Go to [render.com](https://render.com)
2. New Web Service (Backend)
3. New Static Site (Frontend)

### AWS/Azure/GCP
See `DEPLOYMENT.md` for detailed instructions.

---

## Prerequisites

- Docker & Docker Compose installed
- Model files in `backend/models/`:
  - `deit3_best_traced.pt`
  - `vit_best_traced.pt`

---

## Troubleshooting

**Port already in use?**
```bash
# Change ports in docker-compose.yml
```

**Models not found?**
```bash
# Ensure models are in backend/models/
ls backend/models/
```

**Build fails?**
```bash
# Clean and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

For detailed deployment instructions, see `DEPLOYMENT.md`

