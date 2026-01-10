from app.database import getenv

from google import genai
from fastapi import APIRouter

client = genai.Client(api_key=getenv("GEMINI_KEY"))

router = APIRouter()

