from app.models import User, Info, Preference, UserPublic
from app.dependencies import get_current_user

from fastapi import APIRouter, HTTPException, Depends
from beanie import PydanticObjectId


router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "name": current_user.name,
    }

@router.get("/me/all", response_model=UserPublic)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/me/info", response_model=Info)
async def get_user_info(current_user: User = Depends(get_current_user)):
    return current_user.info

@router.put("/me/info", response_model=Info)
async def update_user_info(info_data: Info, current_user: User = Depends(get_current_user)):
    current_user.info = info_data
    await current_user.save()
    return current_user.info

@router.get("/me/preferences", response_model=Preference)
async def get_user_preferences(current_user: User = Depends(get_current_user)):
    return current_user.chat_preferences

@router.put("/me/preferences", response_model=Preference)
async def update_chat_preferences(preference_data: Preference, current_user: User = Depends(get_current_user)):    
    current_user.chat_preferences = preference_data
    await current_user.save()
    return current_user.chat_preferences

@router.delete("/me/delete")
async def delete_user(current_user: User = Depends(get_current_user)):    
    await current_user.delete()
    return {"detail": "User deleted successfully"}
