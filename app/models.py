from app.enums import Country, Personality, TherapyStyle, Tone, SupportNeeded, Gender

from beanie import Document
from pydantic import EmailStr, BaseModel
from typing import Dict, Any
from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto"
)

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

    def hash_password(cls, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)