# AI Email Reader - Chrome Extension with Python Backend

A simple Chrome extension that adds AI-powered email summarization and text-to-speech to Gmail using a FastAPI Python backend.

## 📺 Demo

<a href="https://www.youtube.com/watch?v=UJg5aFZ7MF8" target="_blank">
  <img src="/assets/demoPreview.png" alt="Watch the demo" width="400"/>
</a>

Click the image above to watch the demo video on YouTube.

## Simple Architecture

Chrome Extension → FastAPI Backend → AI APIs

## Project Structure

```
smart-email-reader/
├── backend/               # All Python backend code (FastAPI server)
│   ├── main.py            # Main FastAPI app with all API endpoints
│   ├── requirements.txt.  # Python dependencies for the backend
│   └── .env.example       # Template for your API keys and secrets
|
├── extension/             # Chrome extension code (runs in the browser)
│   ├── manifest.json      # Extension’s config: permissions, scripts, and metadata
│   ├── content.js         # Injected into Gmail; extracts email data and calls backend
│   ├── popup.html         # The extension’s popup UI (status, setup help)
│   └── popup.js           # Logic for the popup (backend health, API key checks)
└── TUTORIAL.md            # This tutorial file 
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
   uvicorn backend.main:app --reload
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