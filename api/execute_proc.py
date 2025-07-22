import asyncpg
import os
from fastapi import HTTPException
from .services.event_service import EventService

async def execute_procedure(db_name:str):
    conn = await asyncpg.connect(
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        database=db_name
    )

    try:
        # Call the stored procedure using CALL
        await conn.execute("CALL createEmployeeTable($1);", "public")
        await conn.execute("CALL createDeviceTable($1);", "public")
        await conn.execute("CALL createBranchTable($1);", "public")
        await conn.execute("CALL createEmployeeTable($1);", "public")
        await conn.execute("CALL createLastEventCheckpointTable($1);", "public")
        await conn.execute("CALL createEventTable($1);", "public")
        print("Procedure executed successfully.")

    except Exception as e:
        print(f"Error executing procedure: {e}")

    finally:
        await conn.close()


async def get_event_service():
    try:
        service = EventService()
        await service.run()
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving events: {e}")