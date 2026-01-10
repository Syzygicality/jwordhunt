from app.models import User, Info, Preference
from app.dependencies import get_current_user

from fastapi import APIRouter, HTTPException, Depends
from beanie import PydanticObjectId


router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
    }

@router.get("/me/all")
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me/info", response_model=Info)
async def update_user_info(
    info_data: Info,
    current_user: User = Depends(get_current_user),
):
    current_user.info = info_data
    await current_user.save()
    return current_user.info

@router.put("/me/preferences", response_model=Preference)
async def update_chat_preferences(preference_data: Preference, current_user: User = Depends(get_current_user)):    
    current_user.chat_preferences = preference_data
    await current_user.save()
    return current_user.chat_preferences

@router.delete("/me/delete")
async def delete_user(current_user: User = Depends(get_current_user)):    
    await current_user.delete()
    return {"detail": "User deleted successfully"}
