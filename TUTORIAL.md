# 🚀 Build Your Own AI Email Assistant: From Zero to Hero

## 📖 What's This All About?

Your inbox is packed, your coffee is hot, and you wish someone could just *read your emails for you*. That’s exactly what we’ll build: a Chrome extension that lives inside Gmail, summarizes your emails with AI, and speaks them back to you.  

By the end, you’ll have:
- A Chrome extension that extracts subject, sender, and body  
- AI-powered summaries via an LLM  
- Natural audio generated with a TTS API  
- A simple interface to play or download the summary  

And along the way, you’ll get hands-on with Chrome extension dev, a Python FastAPI backend, and real-world API integrations.

---
## 🛠️ Before We Start

**You’ll need:**
- Python 3.8+  
- Google Chrome  
- Basic knowledge of JavaScript, HTML, and Python  

**Accounts:**  
- Google Cloud (for AI summarization)  
- Murf AI (for text-to-speech)  

That’s it — you’re ready to dive in 🚀

You may refer the full fledged code of extension over [here](https://github.com/VedantKhairnar/Smart-Email-Reader).
---

## 🏗️ The Master Plan: How Everything Fits Together

Before we start coding like caffeinated developers, let's understand what we're building. Think of it like planning a heist, but legal and for productivity! 😎

```
👤 You reading Gmail  →  🔧 Chrome Extension  →  🐍 Python Backend  →  🤖 AI APIs
                            ↓                      ↓                    ↓
                         Extracts email       Processes with AI      Returns magic
                         content             & generates audio       ✨
```

---

### 🎯 What We're Building

Before we dive into code, let's understand what our Chrome extension needs to accomplish:

**The User Journey:**
1. 👤 User opens Gmail and sees an email they want summarized
2. 🔘 User clicks our "AI Read" button (we need to add this to Gmail)
3. 📧 Extension extracts the email content (subject, sender, body)
4. 🧠 Extension sends data to our Python backend for AI processing
5. 🎵 Backend returns summary + audio URL
6. 📱 Extension shows results in a beautiful popup

**Technical Requirements:**
- **Gmail Integration**: Seamlessly inject our button into Gmail's interface
- **DOM Extraction**: Intelligently read email content from Gmail's complex HTML
- **API Communication**: Reliably talk to our Python backend
- **User Interface**: Provide loading states, error handling, and polished results
- **Settings Management**: Securely store and manage API keys

**Architecture Overview:**
```
Gmail Page → Our Button → Extract Email → Call Backend → Show Results
     ↓           ↓            ↓             ↓            ↓
  Content    DOM Watch    Text Parse    HTTP Request   UI Display
  Script   + Button Add  + Data Clean  + Error Handle + Animation
```

**Why This Approach Works:**
- **Non-intrusive**: We don't break Gmail's functionality
- **Event-driven**: Only activates when user wants it
- **Secure**: No API keys exposed in browser code
- **Responsive**: Fast feedback with loading states

## 🚀 Try the Project Instantly

Want to see it in action right away? Here’s the fastest way to try the Smart Email Reader:

1. **Start the Backend**
   ```bash
   # From the project root
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   cp backend/.env.example backend/.env
   # Add your API keys to backend/.env
   uvicorn backend.main:app --reload

## 🧩 Load the Chrome Extension & Try It Out

1. **Load the Extension**
   - Go to `chrome://extensions/` in Chrome
   - Enable **Developer mode** (toggle in the top right)
   - Click **Load unpacked** and select the `extension/` folder

2. **Open Gmail and Test**
   - Open any email in Gmail
   - Click the **“AI Read”** button in the toolbar
   - Instantly see the summary and listen to the audio!

> **No extra setup needed:** All API keys stay safely in the backend. The extension just works.

If you get stuck, open the extension popup for backend/API key status and follow the guided steps!

---

## 🤔 Why These APIs? (Spoiler: They're Awesome)

Let me tell you why we picked our AI teammates...

### 🧠 Google Gemini: Our AI Brain

**Why Gemini rocks:**
- 💰 **Free tier that doesn't suck:** 15 requests per minute without paying a dime(as per the model you use)
- ⚡ **Fast as lightning:** Responses in 1-2 seconds (faster than most humans!)
- 🎯 **Actually understands emails:** It gets context, tone, and what's important
- 🔧 **Dead simple API:** No PhD in computer science required

**What we considered:**
- *OpenAI GPT:* Powerful and widely used, but requires a paid subscription from the start. 💸
- *Claude:* Innovative, with a limited free tier suitable for light experimentation.

### 🎵 Murf AI: Our Voice

**Why Murf is the MVP:**
- 🎭 **Voices that don't sound like robots:** Seriously, they're impressively human
- 🆓 **10 minutes free monthly:** Perfect for getting started
- 🌍 **120+ voices in 20+ languages:** Want a British accent? French? You got it!
- 👨‍💻 **Developer-friendly:** Their API documentation gets you up in minutes

**The competition:**
- *ElevenLabs:* Premium quality but at a premium price 💎💰
- *Cartesia:* A newer option in the market, still expanding its features.

*Trust me, after trying them all, these are the sweet spot of quality + accessibility!*

---

## 🎯 Project Setup: Let's Build This Thing!

Alright, time to roll up our sleeves and get our hands dirty! First, let's create our project home.

### Project layout (current repository)

This repository uses a simple, explicit layout with separate folders for backend and extension code:

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
This tutorial will reference files in `backend/` and `extension/` throughout.

### Next Step: Getting API Keys (the secret sauce)

- **Gemini:** Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey)  
- **Murf:** Generate an API key at [Murf AI](https://murf.ai/)  

### Keep secrets in the backend

The extension uses a backend-first approach: API keys are stored and used only by the Python backend. Create `backend/.env` (copy the example) and populate it with your keys:

```bash
cp backend/.env.example backend/.env
# then edit backend/.env and set GEMINI_API_KEY and MURF_API_KEY
```

> **Note:** See `.env.example` for required environment variables. All secrets are managed in `.env`.

Make sure `backend/.env` is in `.gitignore` so keys are not committed.

---

## 🎭 Building the Chrome Extension: Smart Email Reader

## Now, let's build it step-by-step!

### 📜 Step 1: The Manifest - Our Extension's ID Card

Every Chrome extension needs to introduce itself to Chrome. Think of this as filling out a visitor badge that tells security (Chrome) who you are and what rooms (websites) you're allowed to enter.

**What our manifest needs to declare:**
- "Hi, I'm the AI Email Reader extension"
- "I need permission to read Gmail pages and store settings"
- "I want to inject code into Gmail"
- "I need to communicate with localhost:8000 (our backend)"

Use the `manifest.json` from the repository (`extension/manifest.json`). Key points:

- `permissions`: we request `activeTab` only. We don't store API keys in the extension.
- `host_permissions`: includes `https://mail.google.com/*` and the local backend hosts (`http://localhost:8000/*`, `http://127.0.0.1:8000/*`).
- `content_scripts`: injects `content.js` on Gmail pages.

### Creating Required Extension Files

If you don’t see `config.js` or `popup.js` in the `extension/` folder, create them manually:

- **config.js**:  
  Create a file named `config.js` in the `extension/` folder and add:
  ```js
  // extension/config.js
  const BACKEND_BASE_URL = 'http://localhost:8000'; // Update if your backend runs elsewhere
  ```

- **popup.js**:  
  Create a file named `popup.js` in the `extension/` folder. This file will handle the popup logic, such as checking backend health and displaying results. You can refer to the tutorial and sample code for the required logic.

> Make sure both files are saved in the `extension/` directory so the extension works as expected.

### 🕵️ Step 2: The Content Script - Our Gmail Detective


**What This Component Does:**
The content script is injected into Gmail, adds the “AI Read” button, extracts email data, and calls the backend for summary and audio. It never stores API keys in the browser.

**Key patterns:**
- Waits for Gmail to load and watches for navigation changes
- Injects a button into the Gmail toolbar
- Extracts subject, sender, and body using multiple selectors
- Calls backend endpoints for summarization and audio
- Handles errors and displays results in Gmail

**Essential code snippets:**
```javascript
// Add button to Gmail toolbar
const toolbar = document.querySelector('.nH .bHJ') || document.querySelector('[role="toolbar"]');
// ... create and insert button ...

// Extract email data
const subject = document.querySelector('.hP')?.textContent.trim() || 'No subject';
const sender = document.querySelector('.gD span')?.textContent.trim() || 'Unknown sender';
const content = document.querySelector('.ii.gt .a3s.aiL')?.textContent.trim() || '';

// Call backend for summary
const summary = await fetch(`${BACKEND_BASE_URL}/api/v1/email/summarize`, { method: 'POST', ... });

// Call backend for audio
const audio = await fetch(`${BACKEND_BASE_URL}/api/v1/email/generate-audio`, { method: 'POST', ... });

// Show results in Gmail
// ...insert summary and audio player into the DOM...
```

> See popup.js and popup.html for how the audio is played or downloaded in the extension UI.

**Best practices:**
- Never include API keys in the extension
- Use multiple selectors for robust extraction
- Only call backend endpoints
- Show clear errors if extraction or backend fails

### 🎛️ Step 3: The Popup - Backend Health & Setup Helper

**What This Component Does:**
The popup checks if your backend is running and if API keys are set up—no API keys are ever stored in the extension.

**Key patterns:**
- Shows backend status with colored dots (green/yellow/red)
- Checks backend health on load and refresh
- Tells you if API keys are missing and how to fix it
- All API keys live in `backend/.env`, never in the extension

**Essential code snippets:**
```js
// Check backend health
const res = await fetch(`${BACKEND_BASE_URL}/`);
if (res.ok) { /* show green dot, hide setup help */ }
else { /* show red dot, show setup help */ }

// Check if API keys are missing
const test = await fetch(`${BACKEND_BASE_URL}/api/v1/email/summarize`, { method: 'POST', ... });
if (test.status === 500) { /* show yellow dot, show API key setup steps */ }
```

**Best practices:**
- Never ask for or store API keys in the extension
- Give clear, actionable setup steps if backend or keys are missing
- Use simple, friendly UI cues (dots, messages)

### 🎨 Step 4: Making Things Beautiful - The Art of Extension Styling

**What This Component Does:**
CSS makes the extension look modern and professional, with clean buttons, results, and popups that fit Gmail’s style.

**Key patterns:**
- Modern button styles with hover/disabled states
- Results box with clear summary and audio player
- Responsive and accessible design
- High z-index so UI appears above Gmail

**Essential CSS- styles.css:**
```css
.ai-read-btn { background: #4285f4; color: white; border-radius: 4px; padding: 8px 12px; }
.ai-read-btn:hover { background: #3367d6; }
.ai-read-btn:disabled { background: #ccc; }
.ai-results { background: #f8f9fa; border-left: 4px solid #4285f4; border-radius: 4px; margin-top: 15px; padding: 15px; }
.ai-summary h4, .ai-audio h4 { color: #333; font-size: 14px; }
.ai-audio audio { width: 100%; margin-top: 5px; }
```

**Best practices:**
- Use classes to avoid breaking Gmail’s layout
- Keep styles minimal and modern
- Test on different screen sizes and browsers

---

## 🐍 Building the Python Backend: The Brain Behind the Operation

### 🎯 What Our Backend Needs to Accomplish

**Backend mission:**
- Securely connect extension to AI APIs (never expose API keys)
- Summarize emails (Gemini) and generate audio (Murf)
- Handle CORS, errors, and fast responses

**Key endpoints:**
- `GET /` — Health check
- `POST /api/v1/email/summarize` — Summarize email content
- `POST /api/v1/email/generate-audio` — Generate speech from summary

**Best practices:**
- Store API keys in `.env` (never in code or extension)
- Use async FastAPI for performance
- Validate input with Pydantic
- Handle errors gracefully, return clear JSON

**Why backend-first?**
- Security: API keys never touch browser
- CORS: Extension can call backend, not AI APIs directly
- Centralized error handling and rate limiting

---

### 📋 Step 1: Setting Up Our Dependencies - The Toolkit

**Backend dependencies:**
- FastAPI, uvicorn, aiohttp, python-dotenv

**Quick setup:**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn[standard] aiohttp python-dotenv
```
Or use the provided `requirements.txt`:
```bash
pip install -r backend/requirements.txt
```

**Why:**
- FastAPI: API server
- uvicorn: run server
- aiohttp: async HTTP calls
- python-dotenv: load secrets from `.env`

### 🏗️ Step 2: Building Our FastAPI Server - The Command Center


**Key patterns:**
- Async FastAPI app with CORS
- API keys from `.env` only
- Pydantic models for input
- Endpoints:
  - `GET /` (health)
  - `POST /api/v1/email/summarize` (Gemini summary)
  - `POST /api/v1/email/generate-audio` (Murf TTS)
- Error handling: always return JSON

**Essential code:**
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import aiohttp, os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Request model for summarization endpoint
class SummarizeRequest(BaseModel):
    email_content: str
    sender: str = ""
    subject: str = ""

# Request model for audio generation endpoint
class AudioRequest(BaseModel):
    text: str

# Health check endpoint
@app.get("/")
async def root():
    return {"status": "running"}

# Summarize email endpoint
@app.post("/api/v1/email/summarize")
async def summarize_email(request: SummarizeRequest):
    # Get Gemini API key from environment
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    # Prepare prompt for Gemini
    prompt = f"Summarize: {request.email_content}"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"
    # Make async request to Gemini API
    async with aiohttp.ClientSession() as s:
        async with s.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}) as r:
            if r.status == 200:
                data = await r.json()
                # Return summary from Gemini response
                return {"success": True, "summary": data["candidates"][0]["content"]["parts"][0]["text"]}
            # Handle Gemini API error
            raise HTTPException(status_code=500, detail="Gemini error")

# Generate audio endpoint
@app.post("/api/v1/email/generate-audio")
async def generate_audio(request: AudioRequest):
    # Get Murf API key from environment
    api_key = os.getenv("MURF_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Murf API key not configured")
    url = "https://api.murf.ai/v1/speech/generate"
    # Make async request to Murf API
    async with aiohttp.ClientSession() as s:
        async with s.post(url, headers={"api-key": api_key}, json={"voiceId": "en-US-ken", "text": request.text, "format": "MP3"}) as r:
            if r.status == 200:
                data = await r.json()
                # Return audio file URL from Murf response
                return {"success": True, "audio_url": data.get("audioFile", "mock_audio_url")}
            # Handle Murf API error (return mock audio URL)
            return {"success": False, "error": "Audio generation failed. Please try again later.", "audio_url": "mock_audio_url", "mock": True}

# Run the app with Uvicorn if executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Best practices:**
- Never expose API keys
- Always validate input
- Return clear errors
- Use async for performance

---

## Integration & Testing

### 1. Start the Backend Server

Use the Python venv + uvicorn workflow to run the FastAPI backend. If you prefer, the repository may include a convenience script (`server.sh`) that wraps these steps — it's optional.

Recommended manual steps:

```bash
# Create and activate a virtual environment (macOS / Linux)
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the FastAPI app with uvicorn (from project root)
# This runs the app at http://localhost:8000 and exposes the OpenAPI docs at /docs
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

If the project provides `server.sh`, it's a convenience wrapper that may perform the same steps (create venv, install deps, set environment variables, then run `uvicorn`). You can use it if you like, but the explicit `uvicorn` command above is equivalent and clearer for troubleshooting.

Expected output when the server starts (example):

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using statreload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Visit `http://localhost:8000/docs` to open the interactive API documentation.

### Quick Smoke Test (optional)

To quickly verify your backend is reachable and the summarization endpoint works, run the included smoke test script. It requires no extra packages and uses the standard library.

```bash
# From the project root (macOS / zsh)
python3 backend/smoke_test.py --url http://localhost:8000
```

Expected outcome:
- The script prints the healthcheck response from `GET /`.
- It then posts a small test email to `/api/v1/email/summarize` and prints the response (truncated).
- Exit code `0` indicates success; non-zero indicates a problem.

If you prefer a single-line quick check without the script, you can use `curl`:

```bash
curl -sS http://localhost:8000/
curl -sS -X POST http://localhost:8000/api/v1/email/summarize -H 'Content-Type: application/json' -d '{"email_content":"Test","sender":"x","subject":"test"}'
```

### 2. Load Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select your project folder (the folder that contains `manifest.json`)
5. The extension should appear in your extensions list

### 3. Configure the Extension for Backend-First Flow

We no longer store or enter API keys in the extension. The backend holds the API keys and exposes endpoints the extension talks to. Verify `extension/config.js` points to your running backend:

```js
// extension/config.js
const BACKEND_BASE_URL = 'http://localhost:8000'; // update if your backend runs elsewhere
```

> **Note:** Update `BACKEND_BASE_URL` in `config.js` if your backend runs on a different host or port.

If you deploy the backend, update this value to your deployed URL and reload the extension.

The extension's popup (`popup.html`) performs a health check against the backend and will indicate whether API keys are configured on the backend. You do not enter API keys in the popup.

### 4. Test With Backend Running and Gmail

1. Ensure your backend is running (see previous step).
2. Open the extension popup (click the extension icon) and verify the backend status shows "Connected to backend". If it reports "Backend running - API keys needed", follow the backend setup steps to add keys to `backend/.env` and restart the server.
3. Open [Gmail](https://mail.google.com) and open any email.
4. Look for the "🤖 AI Read" button in the toolbar and click it.

**Expected Flow (backend-first):**
1. Extension sends the email content to the backend (`POST ${BACKEND_BASE_URL}/api/v1/email/summarize`).
2. Backend returns a summary; extension requests audio via (`POST ${BACKEND_BASE_URL}/api/v1/email/generate-audio`).
3. Extension shows the summary and audio player. If the backend is missing API keys, the popup will guide you to configure them on the backend instead of in the extension.

---

## Error Handling & Edge Cases

### 1. Content Validation

**Short Emails:**
```python
if len(request.email_content.strip()) < 10:
    return {"summary": "Email content too short to summarize meaningfully."}
```

**Long Emails:**
```python
if len(request.text) > 1000:
    request.text = request.text[:1000] + "..."
```

### 2. API Failures

**Graceful Degradation:**
```python
except Exception as e:
    # Return fallback instead of complete failure
    return {
        "success": False,
        "audio_url": "data:audio/mp3;base64,mock_audio_data",
        "error": str(e)
    }
```

### 3. Gmail DOM Changes

**Robust Element Selection:**
```javascript
// Multiple selectors for reliability
const subjectElement = document.querySelector('h2[data-thread-perm-id]') || 
                      document.querySelector('.hP') ||
                      document.querySelector('.bog');
```

### 4. Network Issues

**Timeout Handling:**
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

try {
  const response = await fetch(url, {
    signal: controller.signal,
    // ... other options
  });
} finally {
  clearTimeout(timeoutId);
}
```

---

## Common Pitfalls & Debugging

### 1. CORS Issues

**Problem:** "Failed to fetch" errors
**Solution:** Ensure backend CORS is configured correctly
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

### 2. Gmail DOM Extraction

**Problem:** Email content not found
**Debug:** Check Gmail's HTML structure
```javascript
// Add debugging logs
console.log('Subject element:', subjectElement);
console.log('Body element:', bodyElement);
console.log('Extracted content:', { subject, sender, content });
```

**Solution:** Use multiple selector strategies
```javascript
const bodySelectors = [
  '.ii.gt .a3s.aiL',  // New Gmail
  '.ii.gt',           // Alternative
  '[role="listitem"] .a3s',  // Fallback
];

let bodyElement = null;
for (const selector of bodySelectors) {
  bodyElement = document.querySelector(selector);
  if (bodyElement) break;
}
```

### 3. API Key Issues

**Problem:** 401/403 errors from APIs
**Debug:** Check API key format and permissions
```python
# Add API key validation
if not api_key or not api_key.startswith('AIza'):
    raise HTTPException(status_code=400, detail="Invalid Gemini API key format")
```

### 4. Extension Loading Issues

**Problem:** Extension not injecting into Gmail
**Check:**
- Manifest permissions are correct
- Content script matches Gmail URLs
- No JavaScript errors in DevTools

**Debug in Chrome DevTools:**
```javascript
// Check if extension loaded
console.log('Extension loaded:', !!window.chrome?.runtime);

// Check content script injection
console.log('Content script running on:', window.location.href);
```

### 5. Audio Playback Issues

**Problem:** Audio not playing in browser
**Solutions:**
```javascript
// Check audio format support
const audio = new Audio();
const canPlayMP3 = audio.canPlayType('audio/mpeg') !== '';
console.log('Can play MP3:', canPlayMP3);

// Add error handling
audio.addEventListener('error', (e) => {
  console.error('Audio playback error:', e);
  // Fallback to download link
});
```

---

## 🚀 Scaling Considerations (Future Roadmap)

**When to scale:**
- Lots of users, slow responses, or need for advanced features

**How to scale:**
- Add a database for user data/history
- Use caching (e.g. Redis) for speed
- Split backend into microservices if needed

**Why not now?**
- Focus on core features first—most projects never need big scaling

---

## 🎯 Next Steps & Enhancements

- Email categorization (work/personal/urgent)
- Multi-language & custom voice support
- AI-powered reply suggestions
- Keyboard shortcuts for quick access
- Docker/cloud deployment for production
- Database for user prefs/history
- Rate limiting & monitoring

*Start simple, iterate based on user feedback.*

---

## 🎉 Conclusion


Congrats! You now have a working, secure, backend-first AI email reader Chrome extension.

**Skills demonstrated:**
- Chrome extension & FastAPI backend
- Secure API integration (LLM, TTS)
- Error handling & user experience

Use this as a base for your own productivity, accessibility, or SaaS projects. Keep building! 🚀

---

## Appendix: Troubleshooting Quick Reference

| Issue | Symptom | Solution |
|-------|---------|----------|
| CORS Error | "Failed to fetch" | Check backend CORS config |
| No AI Button | Button not visible | Verify content script injection |
| API Key Error | 401/403 responses | Validate API key format |
| Audio Not Playing | Silent or error | Check audio format support |
| Gmail Changes | Extraction fails | Update DOM selectors |
| Extension Not Loading | No functionality | Check manifest permissions |

**Debug Commands:**
```bash
# Check server status
curl http://localhost:8000/

# View extension console
# Chrome DevTools → Extensions → Inspect views

# Test API directly
curl -X POST http://localhost:8000/api/v1/email/summarize \
  -H "Content-Type: application/json" \
  -d '{"email_content":"Test email","sender":"test","subject":"Test"}'
```

Happy coding! 🎯