from app.database import connect_to_mongo, close_mongo_connection
from app.models import User
from app.routes import auth, chats, enums, users

from fastapi import FastAPI
from contextlib import asynccontextmanager
from beanie import init_beanie

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = connect_to_mongo()
    await init_beanie(database=client.jwordhunt, document_models=[User])
    yield
    close_mongo_connection()

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(enums.router)
app.include_router(chats.router)
app.include_router(users.router)
