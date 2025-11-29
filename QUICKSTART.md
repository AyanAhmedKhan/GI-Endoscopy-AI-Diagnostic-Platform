# 🚀 Quick Start Guide

Get your GI Endoscopy AI Diagnostic Portal up and running in minutes!

## ⚡ Fast Setup (Windows)

### Option 1: Using Batch Scripts (Easiest)

1. **Start Backend:**
   - Double-click `start_backend.bat`
   - Wait for "Application startup complete"
   - Backend will be at `http://127.0.0.1:8000`

2. **Start Frontend:**
   - Open a new terminal/command prompt
   - Double-click `start_frontend.bat`
   - Browser will open automatically at `http://localhost:3000`

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app_gradcam:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 📦 Adding Model Files

Before you can make predictions, you need to add your TorchScript models:

1. Place your model files in `backend/models/`:
   - `deit3_best_traced.pt`
   - `vit_best_traced.pt`

2. The backend will automatically detect and load them on startup.

**Note:** The app will still run without models, but predictions won't work. You'll see a warning message.

## 🧪 Testing the Setup

1. **Test Backend:**
   - Open browser: `http://127.0.0.1:8000`
   - You should see: `{"message": "GI Endoscopy AI Diagnostic Backend with Grad-CAM is running!"}`

2. **Test Frontend:**
   - Open browser: `http://localhost:3000`
   - You should see the upload interface

3. **Test Full Flow:**
   - Upload an endoscopy image
   - Click "Upload & Diagnose"
   - Wait for results (requires model files)

## 🔧 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (needs 3.10+)
- Ensure port 8000 is not in use
- Check if models directory exists: `backend/models/`

### Frontend won't start
- Check Node.js version: `node --version` (needs 16+)
- Delete `node_modules` and reinstall: `npm install`
- Check if port 3000 is available

### Connection errors
- Ensure backend is running before starting frontend
- Check backend URL in frontend `.env` file
- Verify CORS settings in backend

### Model errors
- Ensure model files are valid TorchScript (.pt) files
- Check model file names match exactly: `deit3_best_traced.pt` and `vit_best_traced.pt`
- Verify models are in `backend/models/` directory

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [backend/README.md](backend/README.md) for API details
- Review [frontend/README.md](frontend/README.md) for UI customization

## 💡 Tips

- **GPU Acceleration**: If you have CUDA, models will automatically use GPU
- **Development Mode**: Both servers run in hot-reload mode for easy development
- **API Testing**: Use `http://127.0.0.1:8000/docs` for interactive API documentation

---

**Ready to diagnose! 🩺**

