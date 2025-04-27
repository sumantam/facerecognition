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


async def add_employee_service(
    empid: int,
    email: str,
    name: str,
    branchname: str,
    branchcode: int,
    location: str,
    mobilenumber: str,
    gender: str,
    DOB: str,
    img
):
    conn = await get_db_connection()
    try:

        # ✅ Confirm which database FastAPI is connected to
        db_name = await conn.fetchval("SELECT current_database();")
        print(f"🔍 Connected to database: {db_name}")  # ✅ Check DB name

        # ✅ Save the image file to a local folder
        img_folder = "uploaded_images"
        os.makedirs(img_folder, exist_ok=True)  # ✅ Create folder if it doesn't exist
        img_path = f"{img_folder}/{empid}_{img.filename}"

        with open(img_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)

        # ✅ Convert to JSON format for PostgreSQL jsonb field
        img_json = json.dumps({"path": img_path})


        # ✅ Print the generated SQL command
        sql_statement = f"""
        CALL public.addEmployee(
            {int(empid)},
            '{email}',
            '{name}',
            '{branchname}',
            {int(branchcode)},
            '{location}',
            '{mobilenumber}',
            '{img_json}'::jsonb
        );
        """
        print(f"🔍 SQL Statement to Execute:\n{sql_statement}")  # ✅ Print exact SQL
        
        # ✅ Execute the stored procedure
        # await conn.execute(
        #     "CALL addEmployee($1::INTEGER, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::INTEGER, $6::VARCHAR, $7::VARCHAR, $8::JSONB);",
        #     int(empid),  # ✅ Ensure INTEGER
        #     email,  # ✅ Ensure VARCHAR
        #     name,
        #     branchname,
        #     int(branchcode),  # ✅ Ensure INTEGER
        #     location,
        #     mobilenumber,
        #     json.loads(img_json)  # ✅ Ensure JSONB
        # )

        await conn.execute(
            "CALL addEmployee($1, $2, $3, $4, $5, $6, $7, $8, $9);",
            int(empid),  # ✅ PostgreSQL handles type conversion
            email,
            name,
            branchname,
            int(branchcode),
            location,
            mobilenumber,  # ✅ Now including mobile number
            json.dumps(img_json),  # ✅ Ensures JSONB type
            "public"  # ✅ Ensure schema name is passed
        )

        print ({"message": "User added successfully"})

        fd = client.FaceData()
        host = os.environ.get('HIKVISION_ACT_HOST')

        # Imp parameters used to add an user to the hikvision device
        faceLibType = 'blackFD'
        FDID = str(1)
        FPID = str(empid)
        city = location
        bornTime = DOB
        faceURL = img_path

        print("Parameters are : ", faceLibType, FDID, FPID, name, gender, bornTime, city, faceURL)
        result = fd.face_data_add(
            faceLibType,
            FDID,
            FPID,
            name,
            gender,
            bornTime,
            city,
            faceURL,
            host1=host,
            host2=host
        )
        # response = fd.face_data_add('blackFD', '1', '4', 'tessst', 'male', '19940226T000000+0500', 'Tashkent', 'https://i.ibb.co/P9rJSTQ/murod.jpg')
        return {"message": "User added successfully"}
    except Exception as e:
        print(f"❌ Error calling stored procedure: {e}")  # ✅ Print error
        raise HTTPException(status_code=500, detail=f"Error adding employee: {e}")
    finally:
        await conn.close()