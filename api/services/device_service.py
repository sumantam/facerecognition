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


async def add_device_service(
    deviceid: int,
    branchname: str,
    branchcode: int,
    deviceserialno: str,
    devicemodel: str,
    deviceip: str,
    location: str,
    devicestatus: str
):
    conn = await get_db_connection()
    try:

        # ✅ Confirm which database FastAPI is connected to
        db_name = await conn.fetchval("SELECT current_database();")
        print(f"🔍 Connected to database: {db_name}")  # ✅ Check DB name

        await conn.execute(
            "CALL addDevice($1, $2, $3, $4, $5, $6, $7, $8, $9);",
            int(deviceid),  # ✅ PostgreSQL handles type conversion
            branchname,
            int(branchcode),
            deviceserialno,
            devicemodel,
            deviceip,
            location,
            devicestatus,
            "public"  # ✅ Ensure schema name is passed
        )

        return {"message": "Device added successfully"}

        return {"message": "Device added successfully"}
    except Exception as e:
        print(f"❌ Error calling stored procedure: {e}")  # ✅ Print error
        raise HTTPException(status_code=500, detail=f"Error adding device: {e}")
    finally:
        await conn.close()