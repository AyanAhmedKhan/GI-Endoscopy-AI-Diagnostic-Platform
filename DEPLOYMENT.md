# 🚀 GI Endoscopy AI Diagnostic Portal - Deployment Guide

Complete deployment guide for the GI Endoscopy AI Diagnostic Portal.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start with Docker](#quick-start-with-docker)
3. [Production Deployment](#production-deployment)
4. [Cloud Platform Deployments](#cloud-platform-deployments)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Python 3.10+** (for local development)
- **Node.js 18+** (for local development)
- **CUDA-capable GPU** (optional, for faster inference)
- **Model files** (`deit3_best_traced.pt` and `vit_best_traced.pt`) in `backend/models/`

### Install Docker

**Windows:**
```bash
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**macOS:**
```bash
brew install --cask docker
```

---

## 🐳 Quick Start with Docker

### 1. Clone and Prepare

```bash
# Ensure model files are in backend/models/
ls backend/models/
# Should show: deit3_best_traced.pt, vit_best_traced.pt
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🏭 Production Deployment

### Option 1: Docker Compose (Recommended for VPS)

#### 1. Update Environment Variables

Create `.env` file:
```env
REACT_APP_API_URL=http://your-domain.com:8000
DEVICE=cuda
PORT=8000
```

#### 2. Deploy to VPS

```bash
# On your server
git clone <your-repo>
cd <project-directory>

# Copy model files
cp models/* backend/models/

# Build and start
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 3. Configure Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/gi-endoscopy
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Option 2: AWS EC2 Deployment

#### 1. Launch EC2 Instance

- **Instance Type:** `g4dn.xlarge` (GPU) or `t3.large` (CPU)
- **OS:** Ubuntu 22.04 LTS
- **Security Group:** Allow ports 22, 80, 443, 8000, 3000

#### 2. Setup on EC2

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone <your-repo>
cd <project-directory>

# Upload model files (use SCP)
scp -i your-key.pem models/* ubuntu@your-ec2-ip:~/project/backend/models/

# Start services
docker-compose up -d --build
```

#### 3. Configure Domain

Use Route 53 or your DNS provider to point domain to EC2 IP.

---

### Option 3: Google Cloud Platform (GCP)

#### 1. Create Compute Engine Instance

```bash
gcloud compute instances create gi-endoscopy \
    --zone=us-central1-a \
    --machine-type=n1-standard-4 \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=50GB
```

#### 2. Deploy

```bash
# SSH into instance
gcloud compute ssh gi-endoscopy --zone=us-central1-a

# Follow same steps as AWS EC2
```

---

### Option 4: Azure Container Instances

#### 1. Build and Push Images

```bash
# Login to Azure
az login

# Create resource group
az group create --name gi-endoscopy-rg --location eastus

# Create container registry
az acr create --resource-group gi-endoscopy-rg --name giendoscopy --sku Basic

# Build and push backend
az acr build --registry giendoscopy --image backend:latest ./backend

# Build and push frontend
az acr build --registry giendoscopy --image frontend:latest ./frontend
```

#### 2. Deploy Containers

```bash
# Deploy backend
az container create \
    --resource-group gi-endoscopy-rg \
    --name backend \
    --image giendoscopy.azurecr.io/backend:latest \
    --registry-login-server giendoscopy.azurecr.io \
    --cpu 2 --memory 4 \
    --ports 8000

# Deploy frontend
az container create \
    --resource-group gi-endoscopy-rg \
    --name frontend \
    --image giendoscopy.azurecr.io/frontend:latest \
    --registry-login-server giendoscopy.azurecr.io \
    --cpu 1 --memory 1 \
    --ports 80
```

---

### Option 5: Railway.app (Easiest)

#### 1. Connect Repository

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository

#### 2. Configure Services

**Backend:**
- Root: `backend/`
- Start Command: `uvicorn app_gradcam:app --host 0.0.0.0 --port $PORT`
- Environment: `PORT` (auto-set)

**Frontend:**
- Root: `frontend/`
- Build Command: `npm install && npm run build`
- Start Command: `npx serve -s build -l $PORT`
- Environment: `REACT_APP_API_URL` (set to backend URL)

---

### Option 6: Render.com

#### 1. Backend Service

1. Go to [Render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app_gradcam:app --host 0.0.0.0 --port $PORT`
   - **Environment:** `PORT` (auto-set)

#### 2. Frontend Service

1. New → Static Site
2. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
   - **Environment:** `REACT_APP_API_URL` (backend URL)

---

## 🔐 Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DEVICE` | Device for inference (`cuda` or `cpu`) | `cpu` |
| `PORT` | Backend port | `8000` |
| `HOST` | Backend host | `0.0.0.0` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000` |

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem:** Models not found
```bash
# Ensure models are in backend/models/
ls backend/models/
```

**Problem:** CUDA out of memory
```bash
# Use CPU instead
export DEVICE=cpu
```

**Problem:** Port already in use
```bash
# Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use port 8001
```

### Frontend Issues

**Problem:** API connection failed
```bash
# Check REACT_APP_API_URL
echo $REACT_APP_API_URL

# Rebuild with correct URL
docker-compose build --no-cache frontend
```

**Problem:** Build fails
```bash
# Clear node_modules and rebuild
docker-compose build --no-cache frontend
```

### Docker Issues

**Problem:** Permission denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

**Problem:** Out of disk space
```bash
# Clean up Docker
docker system prune -a
```

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8000/

# Frontend health
curl http://localhost:3000/
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

---

## 🔒 Security Checklist

- [ ] Change default ports in production
- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Set up firewall rules
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Regular security updates
- [ ] Backup model files
- [ ] Monitor logs for suspicious activity

---

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review this guide
3. Check GitHub issues
4. Contact support

---

## 🎉 Success!

Your GI Endoscopy AI Diagnostic Portal is now deployed! 🚀

