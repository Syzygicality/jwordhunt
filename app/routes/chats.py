from app.models import User, Chat, MessageCreate, Message
from app.database import getenv
from app.dependencies import get_current_user
from app.gemini import template

from google import genai
from google.genai import types
from fastapi import APIRouter, Depends, HTTPException
from beanie import PydanticObjectId
import json

client = genai.Client(api_key=getenv("GEMINI_KEY"))

router = APIRouter(prefix="/chats", tags=["Gemini Chat"])

@router.get("/{chat_id}", response_model=Chat)
async def get_chat_messages(chat_id: str, user: User = Depends(get_current_user)):
    chat = next((c for c in user.chats if str(c.id) == chat_id), None)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.post("/", response_model=Message)
async def create_chat(message: MessageCreate, user: User = Depends(get_current_user)):
    chat = Chat(messages=[Message(role="user", message=message.content)])
    user.chats.append(chat)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[types.Content(role=msg.role, parts=[types.Part(text=msg.content)]) for msg in chat.messages],
        config=types.GenerateContentConfig(
            system_instruction=template(user),
            response_mime_type="application/json"
        )
    )
    try:
        content = json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=502, detail="Model return invalid JSON.") from e
    therapist = Message(role="model", content=content["response_content"])
    chat.messages.append(therapist)
    memory = user.info.memory
    for key, value in content["memory_changes"].items():
        memory[key] = value
    await user.save()
    return therapist

@router.post("/{chat_id}", response_model=Message)
async def post_new_message(chat_id: str, message: MessageCreate, user: User = Depends(get_current_user)):
    chat = next((c for c in user.chats if str(c.id) == chat_id), None)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    chat.messages.append(Message(role="user", content=message.content))
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[types.Content(role=msg.role, parts=[types.Part(text=msg.content)]) for msg in chat.messages],
        config=types.GenerateContentConfig(
            system_instruction=template(user),
            response_mime_type="application/json"
        )
    )
    try:
        content = json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=502, detail="Model return invalid JSON.") from e
    therapist = Message(role="model", content=content["response_content"])
    chat.messages.append(therapist)
    memory = user.info.memory
    for key, value in content["memory_changes"].items():
        memory[key] = value
    await user.save()
    return therapist

@router.delete("/{chat_id}")
async def delete_chat(chat_id: str, user: User = Depends(get_current_user)):
    result = await User.find_one(
        User.id == user.id
    ).update(
        {
            "$pull": {
                "chats": {"id": PydanticObjectId(chat_id)}
            }
        }
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"detail": "Chat successfully deleted"}