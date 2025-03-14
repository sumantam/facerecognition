import asyncpg
import os
import shutil
import json
from dotenv import load_dotenv
import api.hikvision_isapi_wrapper as client
from api.db import get_db_connection

# ✅ Load environment variables
load_dotenv()


async def add_employee_service(
    empid: int,
    email: str,
    name: str,
    branchname: str,
    branchcode: int,
    location: str,
    img
):
    conn = await get_db_connection()
    try:
        # ✅ Save the image file to a local folder
        img_folder = "uploaded_images"
        os.makedirs(img_folder, exist_ok=True)  # ✅ Create folder if it doesn't exist
        img_path = f"{img_folder}/{empid}_{img.filename}"

        with open(img_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)

        # ✅ Convert to JSON format for PostgreSQL jsonb field
        img_json = json.dumps({"path": img_path})

        # ✅ Call Stored Procedure
        await conn.execute(
            "CALL addEmployee($1, $2, $3, $4, $5, $6, $7);",
            empid, email, name, branchname, branchcode, location, img_json
        )

        fd = client.FaceData()
        # response = fd.face_data_add('blackFD', '1', '4', 'tessst', 'male', '19940226T000000+0500', 'Tashkent', 'https://i.ibb.co/P9rJSTQ/murod.jpg')
        return {"message": "User added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()