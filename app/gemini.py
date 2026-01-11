from app.database import getenv
from app.models import User

from google import genai

client = genai.Client(api_key=getenv("GEMINI_KEY"))

def template(user: User):
    return str({
        "instruction": "You are an AI therapist with an anonymized patient/client. When referring to their name, use the placeholder <name> instead. Your memory object located in userInfo is your knowledge of the user. If the user gives meaningful information in their response, update your member accordingly. (see response structure)",
        "personality": user.chat_preferences.personality,
        "user_info": user.info,
        "tone": user.chat_preferences.tone,
        "therapy_style": user.chat_preferences.therapy_style,
        "support_needed": user.chat_preferences.support_needed,
        "response_structure": {
            "memory_changes": {
                "attribute to be added/updated in memory": "value of attribute",
                "etc.": "etc."
            },
            "response_content": "text"
        }
    })
