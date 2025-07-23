import asyncio
import asyncpg
import os
import json
from dotenv import load_dotenv
from datetime import datetime
from fastapi import HTTPException
import api.hikvision_isapi_wrapper as client
from api.db import get_db_connection
import asyncio
import random 

# ✅ Load environment variables
load_dotenv()

class EventService:
    def __init__(self):
        self._last_event_time = None
        self.conn = None
        self.schema_name = 'public'

    async def ensure_event_checkpoint(self):
        query = f'SELECT COUNT(*) FROM "{self.schema_name}"."LastEventCheckpoint";'
        result = await self.conn.fetchval(query)

        if result == 0:
            default_checkpoint = datetime(2025, 4, 30)
            insert_query = f'''
                INSERT INTO "{self.schema_name}"."LastEventCheckpoint"(last_event_time)
                VALUES ($1);
            '''
            await self.conn.execute(insert_query, default_checkpoint)
            print(f"✅ Inserted default checkpoint: {default_checkpoint}")
        else:
            print("✅ Checkpoint already exists.")

    async def load_last_event_time(self):
        query = f'SELECT last_event_time FROM "{self.schema_name}"."LastEventCheckpoint" LIMIT 1'
        self._last_event_time = await self.conn.fetchval(query)
        print(f"📌 Loaded last event time: {self._last_event_time}")

    async def update_last_event_time(self, new_time):
        print(f"Last Event Time -------------------------------{new_time}")
        query = f'UPDATE "{self.schema_name}"."LastEventCheckpoint" SET last_event_time = $1'
        await self.conn.execute(query, datetime.fromisoformat(new_time))
        self._last_event_time = new_time
        print(f"🕒 Updated last event time to: {new_time}")
        asyncio.sleep(20)

    def callback(self, event):
        event_time_str = event.get('date')
        if not event_time_str:
            return

        event_time = datetime.fromisoformat(event_time_str)
        if event_time > self._last_event_time:
            print(f"✅ New event: {event}")
            # Trigger async update
            asyncio.create_task(self.update_last_event_time(event_time))
        else:
            print(f"⏩ Skipping old event from {event_time}")

        
    async def run(self):
        self.conn = await get_db_connection()
        try:
            db_name = await self.conn.fetchval("SELECT current_database();")
            print(f"🔍 Connected to database: {db_name}")

            await self.ensure_event_checkpoint()
            await self.load_last_event_time()

            event_instance = client.Event(self._last_event_time)
            print("🎧 Listening to events...")
            event_instance.start_listen_events(self.callback)
            manual_search_id = f"{random.getrandbits(32):08x}-{random.getrandbits(16):04x}-{random.getrandbits(16):04x}-{random.getrandbits(16):04x}"
            print(f"The manual search id is {manual_search_id}")
            result = event_instance._search_historical_events(manual_search_id)
            records = result["data"]
            endtime = result["end_time"]
            
            # print(" Incoming Records is ", records)

        #  Insert int to the Database after parsing
            
            # empID VARCHAR,
            # name VARCHAR(255),
            # cardNo VARCHAR(255),
            # eventTypes VARCHAR(255),
            # eventTime TIMESTAMP,
            # last_event_time TIMESTAMP,
            # schemaName VARCHAR DEFAULT 'public'

            info_list = records["AcsEvent"]["InfoList"]
            
            for rec in info_list:
                # print (rec)
                # print(f"empId: {rec['employeeNoString']}, name: {rec['name']}, cardNo: {rec['cardReaderNo']}, eventTypes: {rec['attendanceStatus']}, eventTime: {rec['time']}, lastEventTime: {endtime}")
                await self.conn.execute("""
                    CALL addEvent($1, $2, $3, $4, $5, $6, 'public');
                """, *(
                    rec['employeeNoString'],
                    rec['name'],
                    str(rec['cardReaderNo']),
                    rec['attendanceStatus'],
                    datetime.fromisoformat(rec['time']),
                    datetime.fromisoformat(endtime)
                ))
            
            await self.update_last_event_time(endtime)
            print("Data inserted successfully.")            
            print(f"The event status is {event_instance.get_status()}")
            print(event_instance.stop_listen_events())
        finally:
            await self.conn.close()
            
# async def get_event_service():
#     try:
#         service = EventService()
#         await service.run()
#     except Exception as e:
#         print(f"❌ Error: {e}")
#         raise HTTPException(status_code=500, detail=f"Error retrieving events: {e}")

