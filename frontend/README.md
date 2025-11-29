# Frontend - GI Endoscopy AI Diagnostic Portal

React + Tailwind CSS frontend for the GI Endoscopy AI Diagnostic Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure API URL in `.env`:
```
REACT_APP_API_URL=http://127.0.0.1:8000
```

3. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Features

- Image upload with preview
- Real-time AI diagnosis
- Grad-CAM heatmap visualization
- Top-3 predictions with confidence scores
- Responsive design

