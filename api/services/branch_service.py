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


async def add_branch_service(
    branchid: int,
    branchname: str,
    location: str,
    branchaddress: str,
    branchmedium: str
):
    conn = await get_db_connection()
    try:

        # ✅ Confirm which database FastAPI is connected to
        db_name = await conn.fetchval("SELECT current_database();")
        print(f"🔍 Connected to database: {db_name}")  # ✅ Check DB name

        await conn.execute(
            "CALL addBranch($1, $2, $3, $4, $5, $6);",
            int(branchid),
            branchname,
            location,
            branchaddress,
            branchmedium,
            "public"  # ✅ Ensure schema name is passed
        )

        return {"message": "Branch added successfully"}

    except Exception as e:
        print(f"❌ Error calling stored procedure: {e}")  # ✅ Print error
        raise HTTPException(status_code=500, detail=f"Error adding branch: {e}")
    finally:
        await conn.close()