from app.enums import Personality, Tone, TherapyStyle, SupportNeeded, Gender

from fastapi import APIRouter

router = APIRouter(prefix="/choices", tags=["Choices"])

@router.get("/support-needed")
def get_support_needed_enums():
    return [member.value for member in SupportNeeded]

@router.get("/personality")
def get_personality_enums():
    return [member.value for member in Personality]

@router.get("/tone")
def get_tone_enums():
    return [member.value for member in Tone]

@router.get("/therapy-style")
def get_therapy_style_enums():
    return [member.value for member in TherapyStyle]

@router.get("/gender")
def get_gender_enums():
    return [member.value for member in Gender]
