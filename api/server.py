from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
import asyncpg
import os
from dotenv import load_dotenv
from api.create_database import create_database
from api.execute_proc import execute_procedure
# Run the async function
import asyncio
from api.controllers import routers

app = FastAPI()

# ✅ Correctly register each router separately
for router in routers:
    app.include_router(router)
    
# ✅ Register routers
# app.include_router(routers)

@app.on_event("startup")
async def startup_event():
    await create_database("faceDetect_db")
    await execute_procedure("faceDetect_db") 

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# ✅ Get All Users
@app.get("/users")
async def get_users():
    conn = await get_db_connection()
    try:
        users = await conn.fetch("SELECT * FROM users;")
        return [dict(user) for user in users]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

