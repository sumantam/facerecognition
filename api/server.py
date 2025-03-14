from fastapi import FastAPI, HTTPException
import asyncpg
from api.create_database import create_database
from api.execute_proc import execute_procedure
# Run the async function
import asyncio
import api.hikvision_isapi_wrapper as client

app = FastAPI()

# Database Connection Helper
async def get_db_connection():
    return await asyncpg.connect(
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_DATABASE", "faceDetect_db")  # ✅ Ensure the correct database
    )

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

# ✅ Add a New User (Call Stored Procedure)
@app.post("/users")
async def add_user(name: str, email: str, branch: str, mobile: str):
    conn = await get_db_connection()
    try:
        await conn.execute("CALL add_user($1, $2, $3, $4);", name, email, branch, mobile)
        return {"message": "User added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()