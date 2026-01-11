import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from os import environ

load_dotenv()

def getenv(config: str) -> str:
    value = environ.get(config)
    if not value:
        raise ValueError(f"{config} is missing from .env.")
    return value

DB_USER = getenv("DB_USER")
DB_PASSWORD = getenv("DB_PASSWORD")
DB_LOCATION = getenv("DB_LOCATION")

MONGO_URL = f"mongodb+srv://{DB_USER}:{DB_PASSWORD}@{DB_LOCATION}/?appName=DeltaHacks"
DB_NAME = "jwordhunt"

client: AsyncIOMotorClient | None = None

def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(
        MONGO_URL,
        server_api=ServerApi("1"),
        tls=True,
        tlsCAFile=certifi.where(),
        tlsVersion="TLS1_2",
    )
    db = client[DB_NAME]
    return client, db

def close_mongo_connection():
    global client
    if client:
        client.close()
