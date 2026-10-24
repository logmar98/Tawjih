import os
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

# Load .env file from project root if present
env_file = Path(__file__).resolve().parent.parent / ".env"
if env_file.exists():
    for raw_line in env_file.read_text().splitlines():
        line = raw_line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

# API Key loaded exclusively from environment or .env file
DEFAULT_KEY = os.environ.get("GEMINI_API_KEY", "")

app = FastAPI(title="Tawjih AI - Google GenAI Backend (Gemma-4)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    apiKey: Optional[str] = None
    student: Optional[Dict[str, Any]] = None
    currentGrades: Optional[Dict[str, Any]] = None

class TestKeyRequest(BaseModel):
    apiKey: Optional[str] = None

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "sdk": "google-genai",
        "primaryModel": "gemma-4-26b-a4b-it",
    }

@app.post("/api/test-key")
def test_key(req: TestKeyRequest):
    key = (req.apiKey or "").strip() or os.environ.get("GEMINI_API_KEY") or DEFAULT_KEY
    try:
        client = genai.Client(api_key=key)
        response = client.models.generate_content(
            model="gemma-4-26b-a4b-it",
            contents="Roses are red...",
        )
        return {
            "success": True,
            "sample": response.text,
            "model": "gemma-4-26b-a4b-it",
        }
    except Exception as e:
        # If gemma model has transient rate limits, try gemini-3.8-flash
        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents="Roses are red...",
            )
            return {
                "success": True,
                "sample": response.text,
                "model": "gemini-3.8-flash",
            }
        except Exception as e2:
            raise HTTPException(status_code=400, detail=f"API error: {str(e2)}")

@app.post("/api/chat")
def chat(req: ChatRequest):
    key = (req.apiKey or "").strip() or os.environ.get("GEMINI_API_KEY") or DEFAULT_KEY
    student = req.student or {}
    grades = req.currentGrades or {}

    student_name = student.get("name", "Élève")
    level = student.get("levelLabel", "Secondaire")
    school = student.get("school", "Lycée")
    city = student.get("city", "Maroc")
    massar = student.get("massarCode", "")
    target = student.get("targetThresholds", {}).get("careerName", "Ingénieur")

    math_score = grades.get("math", 15.0)
    pc_score = grades.get("physics", 15.0)
    svt_score = grades.get("svt", 15.0)
    fr_score = grades.get("french", 14.0)
    en_score = grades.get("english", 15.0)

    system_prompt = f"""You are Tawjih AI (The Moroccan Education GPS / منصة توجيه الذكية), an elite AI academic orientation advisor and career counselor specialized in the Moroccan secondary school system (from 7th grade / 1AC to 12th grade / 2ème Bac).

You are currently advising the student:
- Name: {student_name}
- Grade Level: {level}
- School: {school}, {city}
- Massar Code: {massar}
- Current Grades: Math: {math_score}/20, Physics-Chemistry (PC): {pc_score}/20, SVT: {svt_score}/20, French: {fr_score}/20, English: {en_score}/20.
- Target Locked Career: {target}

Rules:
1. Always ground your answer in these exact current grades.
2. Use precise Moroccan educational terminology (Tronc Commun Scientifique, Sciences Mathématiques A/B, Sciences Physiques, SVT, CPGE, ENSA, FMP, Concours Commun, Seuils Massar).
3. Be inspiring, data-driven, strategic, and practical.
4. Keep answers concise (2 to 3 paragraphs max) with clear bullet points.

Student asks: {req.query}
"""

    try:
        # Use google-genai Client with gemma-4-26b-a4b-it
        client = genai.Client(api_key=key)
        response = client.models.generate_content(
            model="gemma-4-26b-a4b-it",
            contents=system_prompt,
        )
        return {
            "content": response.text,
            "isFallback": False,
            "modelUsed": "gemma-4-26b-a4b-it (google-genai)",
        }
    except Exception as e:
        # Fallback to gemini-3.8-flash if gemma-4-26b-a4b-it encounters issues
        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=system_prompt,
            )
            return {
                "content": response.text,
                "isFallback": False,
                "modelUsed": "gemini-3.8-flash (google-genai)",
            }
        except Exception as e2:
            raise HTTPException(status_code=500, detail=str(e2))
