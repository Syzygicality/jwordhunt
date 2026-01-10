from app.database import connect_to_mongo, close_mongo_connection
from app.models import User
from app.routes.auth import router as auth_router
from app.routes.enums import router as enums_router

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

app.include_router(auth_router)
app.include_router(enums_router)