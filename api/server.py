from fastapi import FastAPI
from api.create_database import create_database
# Run the async function
import asyncio

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await create_database("faceDetect_db")


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
