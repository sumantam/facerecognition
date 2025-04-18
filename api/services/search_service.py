import asyncpg
import os
import shutil
import json
from dotenv import load_dotenv
import api.hikvision_isapi_wrapper as client
from api.db import get_db_connection
from fastapi import HTTPException

# ✅ Load environment variables
load_dotenv()

async def search_all_employee_service():
    conn = await get_db_connection()
    try:
        db_name = await conn.fetchval("SELECT current_database();")
        print(f"🔍 Connected to database: {db_name}")  

        # ✅ Call SELECT statement
        users = await conn.fetch('SELECT * FROM public."Users";')
        user_list = [dict(user) for user in users]
        print("✅ Fetched users:", user_list)

        # (Optional) Return it for an endpoint
        return {"users": user_list}

    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()
