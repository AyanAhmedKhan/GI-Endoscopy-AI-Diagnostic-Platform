@echo off
echo Starting GI Endoscopy AI Backend...
echo.
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo Starting FastAPI server on http://127.0.0.1:8000
echo.
python -m uvicorn app_gradcam:app --reload --port 8000
pause

