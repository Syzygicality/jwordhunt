from app.models import User, Chat, MessageCreate
from app.database import getenv
from app.dependencies import get_current_user

from google import genai
from fastapi import APIRouter, Depends, HTTPException
from beanie import PydanticObjectId

client = genai.Client(api_key=getenv("GEMINI_KEY"))

router = APIRouter(prefix="/chats", tags=["Gemini Chat"])

@router.get("/{chat_id}", response_model=Chat)
async def get_chat_messages(chat_id: str, user: User = Depends(get_current_user)):
    chat = await user.chats.get(PydanticObjectId(chat_id))
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.post("/{chat_id}", response_model=Chat)
async def post_new_message(chat_id: str, message: MessageCreate, user: User = Depends(get_current_user)):
    chat = await user.chats.get(PydanticObjectId(chat_id))
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return 

@router.delete("/{chat_id}")
async def delete_chat(chat_id: str, user: User = Depends(get_current_user)):
    chat = await user.chats.get(PydanticObjectId(chat_id))
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    await chat.delete()
    return {"detail": "Chat successfully deleted"}