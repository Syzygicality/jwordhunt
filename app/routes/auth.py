from app.models import User
from app.auth import create_access_token

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Registration and Login"])

@router.post("/register")
async def register(name: str, email: str, password: str):
    if await User.find_one(User.email == email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(name=name, email=email, hashed_password=User.hash_password(password))
    await user.insert()
    token = create_access_token({"user_id": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user or not user.verify_password(form_data.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"user_id": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

