"""
Simple FastAPI backend for Smart Email Reader Chrome Extension
Tutorial-friendly version with minimal complexity
"""

import os
import asyncio
import aiohttp
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(title="Smart Email Reader API", version="1.0.0")

# Enable CORS for Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Request models
class SummarizeRequest(BaseModel):
    email_content: str
    sender: str = ""
    subject: str = ""

class AudioRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    """API status endpoint"""
    return {"message": "Smart Email Reader API", "status": "running"}

@app.post("/api/v1/email/summarize")
async def summarize_email(request: SummarizeRequest):
    """Summarize email using Gemini AI"""
    try:
        # Log received data for debugging
        print(f"Received request:")
        print(f"   Subject: '{request.subject}'")
        print(f"   Sender: '{request.sender}'")
        print(f"   Content length: {len(request.email_content)} chars")
        print(f"   Content preview: '{request.email_content[:100]}...'")
        
        # Get API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        # Create prompt that includes sender in summary
        prompt = f"""Summarize this email in 2-3 sentences. Include who sent it and what it's about:

From: {request.sender}
Subject: {request.subject}
Content: {request.email_content}

Please start your summary with "This email from [sender name]..." and then summarize the key points."""
        
        # Call Gemini API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json={
                "contents": [{"parts": [{"text": prompt}]}]
            }) as response:
                if response.status == 200:
                    data = await response.json()
                    summary = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"success": True, "summary": summary}
                else:
                    raise HTTPException(status_code=500, detail="Failed to generate summary")
                    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/email/generate-audio")
async def generate_audio(request: AudioRequest):
    """Generate audio using Murf AI"""
    try:
        # Get API key
        api_key = os.getenv("MURF_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Murf API key not configured")
        
        # Call Murf API
        url = "https://api.murf.ai/v1/speech/generate"
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, 
                headers={"api-key": api_key},
                json={
                    "voiceId": "en-US-ken",
                    "text": request.text,
                    "format": "MP3"
                }
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return {
                        "success": True, 
                        "audio_url": data.get("audioFile", "mock_audio_url"),
                        "audio_data": data.get("audioContent", "mock_audio_data")
                    }
                else:
                    # Return mock data for tutorial purposes
                    return {
                        "success": True,
                        "audio_url": "mock_audio_url",
                        "audio_data": "mock_audio_data",
                        "mock": True
                    }
                    
    except Exception as e:
        # Return mock response for tutorial
        return {
            "success": True,
            "audio_url": "mock_audio_url", 
            "audio_data": "mock_audio_data",
            "mock": True,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)