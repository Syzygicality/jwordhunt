from app.enums import Country, Personality, TherapyStyle, Tone, SupportNeeded, Gender

from beanie import Document
from pydantic import EmailStr, BaseModel
from typing import Dict, Any

class Preference(BaseModel):
    personality: list[Personality]
    therapy_style: TherapyStyle
    tone: list[Tone]
    support_needed: SupportNeeded

class Info(BaseModel):
    age: int
    gender: Gender
    country: Country
    memory: Dict[str, Any] = {}

class User(Document):
    email: EmailStr
    hashed_password: str
    name: str
    info: Info | None = None
    preferences: Preference | None = None