from app.enums import Country, Personality, TherapyStyle, Tone, SupportNeeded, Gender

from beanie import Document
from pydantic import EmailStr, BaseModel, Field
from typing import Dict, Any, List
from passlib.context import CryptContext
from uuid import UUID, uuid4

pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto"
)

class MessageCreate(BaseModel):
    content: str

class Message(BaseModel):
    role: str
    content: str

class Chat(BaseModel):
    messages: List[Message]

class Preference(BaseModel):
    personality: list[Personality]
    therapy_style: TherapyStyle
    tone: List[Tone]
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
    chat_preferences: Preference | None = None
    chats: List[Chat] | None = None


    @classmethod
    def hash_password(cls, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)
    
class UserPublic(BaseModel):
    email: EmailStr
    hashed_password: str
    name: str
    info: Info | None = None
    chat_preferences: Preference | None = None
    chats: List[Chat] | None = None