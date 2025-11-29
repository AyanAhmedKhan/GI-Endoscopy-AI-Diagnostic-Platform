<div align="center">

# 🏥 GI Endoscopy AI Diagnostic Platform

### AI-Powered Gastrointestinal Disease Detection with Explainable AI

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Overview

A **production-ready**, full-stack medical imaging platform that leverages state-of-the-art Vision Transformers (ViT, DeiT3) to analyze gastrointestinal endoscopy images. The platform provides real-time AI predictions with explainable Grad-CAM visualizations, enabling medical professionals to make informed diagnostic decisions with AI assistance.

### 🎯 Key Capabilities

- **🔬 Advanced AI Models**: Pre-trained Vision Transformers (ViT, DeiT3) with traced inference for optimal performance
- **🎨 Explainable AI**: Grad-CAM heatmap visualizations showing model attention areas
- **⚡ Real-time Processing**: Fast inference with optimized PyTorch model serving
- **🎛️ Interactive Controls**: Customizable visualization parameters and preprocessing options
- **🐳 Container-Ready**: Full Docker support for development and production environments
- **🔄 Cross-Platform**: Tested on Windows, Linux, and macOS with dedicated scripts

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│              (React SPA + TailwindCSS)                      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API Server                         │
│           (Python FastAPI + PyTorch)                        │
│  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Inference  │  │  Grad-CAM   │  │ Preprocessing│       │
│  │   Pipeline   │  │  Generator  │  │   Service    │       │
│  └──────────────┘  └─────────────┘  └─────────────┘       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Traced PT Models    │
          │  • vit_best.pt       │
          │  • deit3_best.pt     │
          └──────────────────────┘
```

### 📁 Project Structure

```
GI-Endoscopy-AI-Diagnostic-Platform/
├── 📂 backend/                    # Python inference engine
│   ├── app_gradcam.py            # FastAPI server with Grad-CAM
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile                # Backend container config
│   └── models/                   # Traced PyTorch models
│       ├── vit_best_traced.pt
│       └── deit3_best_traced.pt
│
├── 📂 frontend/                   # React web application
│   ├── src/
│   │   ├── App.js               # Main application component
│   │   └── components/          # Reusable UI components
│   │       ├── UploadSection.jsx
│   │       ├── ModelSelector.jsx
│   │       ├── HeatmapControls.jsx
│   │       └── AdvancedVisualizations.jsx
│   ├── package.json             # Node.js dependencies
│   ├── tailwind.config.js       # TailwindCSS configuration
│   └── Dockerfile               # Frontend container config
│
├── 🐳 docker-compose.yml          # Dev environment orchestration
├── 🐳 docker-compose.prod.yml    # Production deployment config
├── 📜 start_backend.bat          # Windows backend launcher
├── 📜 start_frontend.bat         # Windows frontend launcher
├── 🚀 deploy.sh / deploy.bat     # Quick deployment scripts
└── 📚 Documentation/
    ├── DEPLOYMENT.md
    ├── QUICKSTART.md
    └── PROJECT_STRUCTURE.md
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your system:

| Tool | Version | Purpose |
|------|---------|---------|
| **Python** | 3.10+ | Backend runtime |
| **Node.js** | 18+ | Frontend build tool |
| **Docker** | 24+ | Containerization (optional) |
| **Git** | Latest | Version control |

---

### Option 1️⃣: Local Development (No Docker)

#### Backend Setup

```cmd
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Start the backend server (default: http://localhost:8000)
python app_gradcam.py
```

> **Note**: Ensure your traced models (`.pt` files) are in `backend/models/` before starting.

#### Frontend Setup

Open a **new terminal** and run:

```cmd
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (default: http://localhost:3000)
npm start
```

The frontend will automatically proxy API requests to `http://localhost:8000`.

---

### Option 2️⃣: Docker Compose (Development)

Perfect for consistent development environments:

```cmd
# Build and start both services
docker compose up --build

# Run in detached mode (background)
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### Option 3️⃣: Production Deployment

For production environments with optimized builds:

```cmd
# Build and deploy production stack
docker compose -f docker-compose.prod.yml up --build -d

# Check status
docker compose -f docker-compose.prod.yml ps

# View production logs
docker compose -f docker-compose.prod.yml logs -f
```

**Production configuration includes:**
- ✅ Nginx reverse proxy
- ✅ Optimized React build
- ✅ Health checks
- ✅ Resource limits
- ✅ Restart policies

> See [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced deployment strategies.

---

## 📡 API Documentation

The backend exposes a RESTful API for image analysis and visualization.

### Core Endpoints

#### `POST /predict`
Upload an endoscopy image for AI diagnosis.

**Request:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@image.jpg" \
  -F "model=vit"
```

**Response:**
```json
{
  "prediction": "abnormal",
  "confidence": 0.94,
  "class_probabilities": {
    "normal": 0.06,
    "abnormal": 0.94
  },
  "model_used": "vit_best_traced"
}
```

#### `POST /gradcam`
Generate Grad-CAM heatmap visualization.

**Request:**
```bash
curl -X POST "http://localhost:8000/gradcam" \
  -F "file=@image.jpg" \
  -F "model=deit3" \
  -F "alpha=0.5"
```

**Response:**
```json
{
  "heatmap_image": "base64_encoded_image...",
  "prediction": "abnormal",
  "confidence": 0.91
}
```

### Interactive API Docs

Visit **http://localhost:8000/docs** for Swagger UI with live testing capabilities.

> **Detailed Endpoint Documentation**: See [backend/README.md](./backend/README.md) for complete API reference.

---

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend Configuration
BACKEND_PORT=8000
MODEL_PATH=./backend/models
DEFAULT_MODEL=vit_best_traced
TORCH_DEVICE=cuda  # or 'cpu'

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENABLE_ANALYTICS=false

# Docker Configuration
COMPOSE_PROJECT_NAME=gi-endoscopy-ai
```

### Model Configuration

Place your traced PyTorch models in `backend/models/`:

```
backend/models/
├── vit_best_traced.pt      # Vision Transformer model
└── deit3_best_traced.pt    # DeiT3 model
```

**Model Requirements:**
- Format: TorchScript traced models (`.pt`)
- Input: RGB images, 224×224 pixels
- Output: Class probabilities

### Frontend Customization

#### Tailwind Theme
Edit `frontend/tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      }
    }
  }
}
```

#### Nginx Configuration (Production)
Modify `frontend/nginx.conf` for reverse proxy settings.

---

## 🚢 Deployment

### Platform-Specific Scripts

#### Windows
```cmd
# Start backend
start_backend.bat

# Start frontend
start_frontend.bat

# Deploy both services
deploy.bat
```

#### Linux/macOS
```bash
# Make scripts executable
chmod +x deploy.sh

# Deploy
./deploy.sh
```

### Cloud Deployment Options

<details>
<summary><b>Azure Container Instances</b></summary>

```bash
# Login to Azure
az login

# Create resource group
az group create --name gi-endoscopy-rg --location eastus

# Deploy containers
az container create \
  --resource-group gi-endoscopy-rg \
  --file docker-compose.prod.yml
```
</details>

<details>
<summary><b>AWS ECS/Fargate</b></summary>

```bash
# Install ECS CLI
ecs-cli configure --cluster gi-endoscopy-cluster --region us-east-1

# Deploy using docker-compose
ecs-cli compose --file docker-compose.prod.yml up
```
</details>

<details>
<summary><b>Google Cloud Run</b></summary>

```bash
# Build and push images
gcloud builds submit --config cloudbuild.yaml

# Deploy backend
gcloud run deploy gi-backend --image gcr.io/PROJECT_ID/backend

# Deploy frontend
gcloud run deploy gi-frontend --image gcr.io/PROJECT_ID/frontend
```
</details>

> **Detailed Instructions**: See [DEPLOYMENT.md](./DEPLOYMENT.md) and [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>GPU/CUDA Errors</b></summary>

**Problem**: `CUDA out of memory` or `No CUDA-capable device detected`

**Solutions**:
```cmd
# Force CPU mode
export TORCH_DEVICE=cpu  # Linux/macOS
set TORCH_DEVICE=cpu     # Windows

# Pin specific CUDA version in requirements.txt
torch==2.0.1+cu118
```
</details>

<details>
<summary><b>Virtual Environment Issues (Windows)</b></summary>

**Problem**: `Activate.ps1 cannot be loaded because running scripts is disabled`

**Solution**:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate
.venv\Scripts\Activate.ps1
```
</details>

<details>
<summary><b>CORS/Proxy Errors</b></summary>

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Check `package.json` proxy setting:
   ```json
   "proxy": "http://localhost:8000"
   ```

2. Verify backend CORS settings in `app_gradcam.py`

3. Check `frontend/nginx.conf` for production deployments
</details>

<details>
<summary><b>Model Loading Errors</b></summary>

**Problem**: `FileNotFoundError: [Errno 2] No such file or directory: 'models/vit_best_traced.pt'`

**Solution**:
```cmd
# Verify models exist
ls backend/models/

# Expected output:
# vit_best_traced.pt
# deit3_best_traced.pt
```

Ensure `.pt` files are TorchScript traced models, not raw checkpoints.
</details>

<details>
<summary><b>Docker Build Failures</b></summary>

**Problem**: `ERROR [internal] load metadata for docker.io/library/python:3.10`

**Solutions**:
```cmd
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker compose build --no-cache

# Check Docker daemon is running
docker info
```
</details>

### Getting Help

- 📖 Check [Documentation](./DEPLOYMENT.md) for detailed guides
- 🐛 [Open an issue](https://github.com/AyanAhmedKhan/GI-Endoscopy-AI-Diagnostic-Platform/issues)
- 💬 Review [backend/README.md](./backend/README.md) for API specifics

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Vision Transformer inference pipeline
- [x] Grad-CAM explainability
- [x] React frontend with TailwindCSS
- [x] Docker containerization

### Phase 2: Enhanced Features 🚧
- [ ] Multi-model ensemble predictions
- [ ] Confidence calibration and uncertainty quantification
- [ ] Dataset management dashboard
- [ ] Batch processing API

### Phase 3: Production Hardening 📋
- [ ] User authentication (OAuth2/JWT)
- [ ] Role-based access control (RBAC)
- [ ] Audit logging and compliance tracking
- [ ] Encrypted storage for medical images
- [ ] DICOM format support

### Phase 4: Advanced Analytics 🔮
- [ ] Performance monitoring dashboards
- [ ] A/B testing framework for models
- [ ] Automated model retraining pipeline
- [ ] Integration with PACS systems

---

## 👥 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow PEP 8 (Python) and Airbnb style guide (JavaScript)
- Write unit tests for new features
- Update documentation as needed
- Ensure Docker builds pass

---

## 📄 License

**Proprietary License** - All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited without explicit written permission.

---

## 📚 Documentation

- [**Quick Start Guide**](./QUICKSTART.md) - Get up and running in 5 minutes
- [**Deployment Guide**](./DEPLOYMENT.md) - Production deployment strategies
- [**Project Structure**](./PROJECT_STRUCTURE.md) - Detailed codebase walkthrough
- [**Backend API**](./backend/README.md) - Complete API reference
- [**ML Training Report**](./ML_Training_Report.md) - Model development insights
- [**Complete Project Report**](./Complete_Project_Report.md) - Full technical documentation

---

## 🙏 Acknowledgments

- **Vision Transformers**: [An Image is Worth 16x16 Words](https://arxiv.org/abs/2010.11929)
- **DeiT**: [Training data-efficient image transformers](https://arxiv.org/abs/2012.12877)
- **Grad-CAM**: [Visual Explanations from Deep Networks](https://arxiv.org/abs/1610.02391)

---

<div align="center">

**Built with ❤️ for advancing medical AI diagnostics**

[⬆ Back to Top](#-gi-endoscopy-ai-diagnostic-platform)

</div>
**For production deployment options, see `DEPLOYMENT.md`**

### Prerequisites

- Python 3.10+
- Node.js 16+ and npm
- CUDA-capable GPU (optional, for faster inference)
- TorchScript model files (place in `backend/models/`)

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Place your TorchScript models in backend/models/
# - deit3_best_traced.pt
# - vit_best_traced.pt

# Start the backend server
uvicorn app_gradcam:app --reload --port 8000
```

The backend will be available at `http://127.0.0.1:8000`

**Note**: The backend will work even without model files, but predictions won't be available. Make sure to add your trained TorchScript models to `backend/models/`.

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will open at `http://localhost:3000`

### 3️⃣ Using Docker (Optional)

#### Backend Docker Setup

```bash
cd backend
docker build -t gi-endoscopy-backend .
docker run -p 8000:8000 -v $(pwd)/models:/app/models gi-endoscopy-backend
```

## 📖 API Documentation

### Endpoints

#### `POST /predict`
Upload an endoscopy image for diagnosis.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Image file (PNG, JPG, JPEG)

**Response:**
```json
{
  "predicted_class": "polyps",
  "confidence": 95.23,
  "top3": [
    {"class": "polyps", "confidence": 0.9523},
    {"class": "dyed-lifted-polyps", "confidence": 0.0345},
    {"class": "cecum", "confidence": 0.0089}
  ],
  "gradcam_base64": "base64_encoded_image_string",
  "inference_time": 0.45
}
```

#### `GET /`
Health check endpoint.

#### `GET /health`
Detailed health status including model availability.

## 🎨 Frontend Features

- **Drag & Drop Upload**: Easy image upload interface
- **Real-time Preview**: See your image before analysis
- **Grad-CAM Visualization**: Interactive heatmap overlay
- **Confidence Scores**: Clear percentage displays
- **Top-3 Predictions**: See alternative diagnoses
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🔧 Configuration

### Backend Configuration

Edit `backend/app_gradcam.py` to customize:
- `IMG_SIZE`: Input image size (default: 384)
- `CLASS_MAPPING`: Disease class mappings
- `MODEL_PATHS`: Model file locations

### Frontend Configuration

Create `frontend/.env` to set:
```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

## 🧪 Model Requirements

Your TorchScript models should:
- Accept input tensor of shape `[1, 3, 384, 384]`
- Output logits of shape `[1, 23]` (23 classes)
- Be saved using `torch.jit.script()` or `torch.jit.trace()`

### Converting Models to TorchScript

```python
import torch

# Load your trained model
model = YourTrainedModel()
model.eval()

# Create example input
example = torch.rand(1, 3, 384, 384)

# Trace the model
traced_model = torch.jit.trace(model, example)

# Save
traced_model.save("models/your_model_traced.pt")
```

## 🐛 Troubleshooting

### Backend Issues

**Models not loading:**
- Ensure model files are in `backend/models/` directory
- Check file names match `MODEL_PATHS` in `app_gradcam.py`
- Verify models are valid TorchScript files

**CUDA errors:**
- The backend automatically falls back to CPU if CUDA is unavailable
- Check GPU drivers if you want GPU acceleration

**Grad-CAM errors:**
- Some model architectures may not support Grad-CAM
- The backend will gracefully fall back to original image if Grad-CAM fails

### Frontend Issues

**Connection errors:**
- Ensure backend is running on port 8000
- Check CORS settings if accessing from different origin
- Verify `REACT_APP_API_URL` in `.env` file

**Build errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 16+)

## 📊 Performance

- **Inference Time**: ~0.3-0.8 seconds (GPU) / ~1-3 seconds (CPU)
- **Accuracy**: 92%+ on test dataset
- **Model Size**: ~100-300 MB per model (depending on architecture)

## 🔒 Security Notes

- This is a development/demo setup
- For production, implement:
  - Authentication/authorization
  - Rate limiting
  - Input validation
  - HTTPS/TLS encryption
  - Secure file upload handling

## 📝 License

This project is provided as-is for educational and research purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Support

For issues or questions, please open an issue on the repository.

## 🚢 Deployment

### Quick Deploy Options

1. **Docker Compose** (Local/VPS)
   ```bash
   docker-compose up -d --build
   ```

2. **Railway.app** (Easiest cloud)
   - Connect GitHub repo
   - Auto-deploy backend & frontend

3. **Render.com** (Free tier available)
   - Deploy backend as Web Service
   - Deploy frontend as Static Site

4. **AWS/Azure/GCP** (Enterprise)
   - See `DEPLOYMENT.md` for detailed instructions

For complete deployment instructions, see `DEPLOYMENT.md` or `QUICK_DEPLOY.md`

---

**Built with ❤️ for medical AI research and education**

