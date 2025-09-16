# AI Email Reader - Chrome Extension with Python Backend

A simple Chrome extension that adds AI-powered email summarization and text-to-speech to Gmail using a FastAPI Python backend.

## Simple Architecture

Chrome Extension → FastAPI Backend → AI APIs

## Project Structure

```
smart-email-reader/
├── backend/               # FastAPI backend (server)
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── extension/             # Chrome extension (UI + content script)
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html
   └── popup.js
└── README.md              # This file
```

## Quick Setup

1. **Install Python dependencies for the backend:**
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Configure API keys in `backend/.env`:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and set GEMINI_API_KEY and MURF_API_KEY
   ```

3. **Start the backend (development):**
   ```bash
   # From repository root
   uvicorn backend.main:app --reload --port 8000
   ```

4. **Load Chrome extension (in Chrome):**
   - Open Chrome → Extensions → Developer Mode
   - Click "Load unpacked" → Select the `extension/` folder

## How It Works

1. **Extension** detects Gmail emails and adds "AI Read" button
2. **Button click** → sends email content to backend API
3. **Backend** → calls Gemini for summary + Murf for audio
4. **Results** → displayed in Gmail with summary and audio player

## API Endpoints

- `POST /api/v1/email/summarize` - Get email summary
- `POST /api/v1/email/generate-audio` - Generate speech from text

## Tutorial-Friendly

This version is designed for learning:
- **Single backend file** (`main.py` - 70 lines of code)
- **Minimal dependencies** (4 packages)
- **Flat project structure** (no unnecessary folders)
- **Clear separation** between extension and backend
- **Simple error handling** with mock responses
- **No complex abstractions** or enterprise patterns

Perfect for understanding Chrome extension + FastAPI integration!