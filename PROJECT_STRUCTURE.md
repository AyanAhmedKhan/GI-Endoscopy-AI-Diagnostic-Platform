# 📁 Project Structure

Complete file tree of the GI Endoscopy AI Diagnostic Portal:

```
GI_Endoscopy_AI/
│
├── 📄 README.md                    # Main project documentation
├── 📄 QUICKSTART.md               # Quick start guide
├── 📄 PROJECT_STRUCTURE.md        # This file
├── 📄 .gitignore                  # Git ignore rules
│
├── 🚀 start_backend.bat           # Windows script to start backend
├── 🚀 start_frontend.bat          # Windows script to start frontend
│
├── 📂 backend/                    # FastAPI Backend
│   ├── 📄 app_gradcam.py          # Main FastAPI application with Grad-CAM
│   ├── 📄 requirements.txt        # Python dependencies
│   ├── 📄 Dockerfile              # Docker configuration
│   ├── 📄 README.md               # Backend-specific docs
│   ├── 📄 .gitignore             # Backend gitignore
│   │
│   └── 📂 models/                 # TorchScript Model Files
│       ├── 📄 .gitkeep            # Keeps directory in git
│       ├── 🔧 deit3_best_traced.pt  # (Add your model here)
│       └── 🔧 vit_best_traced.pt    # (Add your model here)
│
└── 📂 frontend/                   # React Frontend
    ├── 📄 package.json            # Node.js dependencies
    ├── 📄 tailwind.config.js      # Tailwind CSS configuration
    ├── 📄 postcss.config.js       # PostCSS configuration
    ├── 📄 .gitignore             # Frontend gitignore
    ├── 📄 README.md               # Frontend-specific docs
    │
    ├── 📂 public/                 # Static files
    │   ├── 📄 index.html          # HTML template
    │   └── 📄 manifest.json       # PWA manifest
    │
    └── 📂 src/                    # React source code
        ├── 📄 index.js            # React entry point
        ├── 📄 index.css           # Global styles (Tailwind)
        ├── 📄 App.js              # Main App component
        │
        └── 📂 components/         # React components
            └── 📄 UploadSection.jsx # Upload & results component
```

## 📋 File Descriptions

### Root Files
- **README.md**: Complete project documentation with setup instructions
- **QUICKSTART.md**: Quick start guide for fast setup
- **start_backend.bat**: Windows batch script to start backend server
- **start_frontend.bat**: Windows batch script to start frontend server

### Backend Files
- **app_gradcam.py**: 
  - FastAPI application
  - TorchScript model loading
  - Grad-CAM explainability
  - Image preprocessing
  - Ensemble prediction
  - API endpoints (`/predict`, `/health`)

- **requirements.txt**: Python packages:
  - fastapi, uvicorn
  - torch, torchvision
  - torchcam (Grad-CAM)
  - pillow, numpy

- **Dockerfile**: Container configuration for deployment

### Frontend Files
- **App.js**: Main React component with state management
- **UploadSection.jsx**: 
  - File upload UI
  - Image preview
  - Results display
  - Grad-CAM visualization
  - Top-3 predictions

- **index.css**: Tailwind CSS imports and custom styles
- **tailwind.config.js**: Tailwind theme configuration

## 🔧 Key Technologies

### Backend
- **FastAPI**: Modern Python web framework
- **PyTorch**: Deep learning framework
- **TorchScript**: Optimized model inference
- **TorchCAM**: Grad-CAM implementation
- **Pillow**: Image processing

### Frontend
- **React 18**: UI framework
- **Tailwind CSS**: Utility-first CSS
- **Axios**: HTTP client
- **PostCSS**: CSS processing

## 🎯 Next Steps

1. **Add Model Files**: Place your TorchScript models in `backend/models/`
2. **Install Dependencies**: 
   - Backend: `pip install -r backend/requirements.txt`
   - Frontend: `npm install` in `frontend/`
3. **Start Servers**: Use batch scripts or manual commands
4. **Test**: Upload an endoscopy image and verify predictions

---

**Project is ready for development! 🚀**

