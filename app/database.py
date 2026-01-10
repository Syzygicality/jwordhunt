import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi

MONGO_URI = "mongodb+srv://ew040607_db_user:oGW1VLLo3Nj5eWn3@deltahacks.n3ffzak.mongodb.net/?appName=DeltaHacks"
DB_NAME = "jwordhunt"

client: AsyncIOMotorClient | None = None
db = None

def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(
        MONGO_URI,
        server_api=ServerApi("1"),
        tls=True,
        tlsCAFile=certifi.where(),
    )
    db = client[DB_NAME]

def close_mongo_connection():
    global client
    if client:
        client.close()
