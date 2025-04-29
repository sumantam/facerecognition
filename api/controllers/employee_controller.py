import asyncio
import json
from pydantic import ValidationError
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from api.services.employee_service import add_employee_service  # ✅ Import service function
from .schemas import EmployeeData
import threading
# import os


# ✅ Create API Router
router = APIRouter()

# async def add_employee(payload: EmployeeCreateWrapper ) :
# ✅ Add a New User (Call Stored Procedure)
@router.post("/employees")
async def add_employee(
    data: str = Form(...),
    img: UploadFile = File(...)
):
    # empid: int = Form(...),
    # email: str = Form(...),
    # name: str = Form(...),
    # branchname: str = Form(...),
    # branchcode: int = Form(...),
    # location: str = Form(...),
    # mobilenumber: str = Form(...),
    # gender: str = Form(...),
    # DOB: str = Form(...),
    # img: UploadFile = File(...)

    try:
        parsed = json.loads(data)
        employee = EmployeeData(**parsed)
    except (json.JSONDecodeError, ValidationError) as e:
            raise HTTPException(status_code=400, detail=f"Invalid data: {str(e)}")
    # employee = payload.data

    empid = employee.basic.empid
    email = employee.basic.email
    name = employee.basic.name
    branchname = employee.basic.branchname
    branchcode = employee.basic.branchcode
    location = employee.basic.location
    mobilenumber = employee.basic.mobileNumber
    gender = employee.basic.gender
    DOB = employee.basic.DOB
    # img_url = employee.img

    print("Inside call to add_employee:")

    print(f"Employee name: {name}")
    print(f"Employee gender: {gender}")
    print(f"Employee DOB: {DOB}")
    print(f"Image filename: {img.filename}")

    # Call your service here normally
    # result = await add_employee_service(...)

    # return {"message": "Employee created"}

    # img: UploadFile = File(...)

    # return

    try:
        print("Inside the call to employees")
        print ("Gender", gender, "DOB", DOB)
        result = await add_employee_service(empid, email, name, branchname, branchcode, location, mobilenumber, gender, DOB, img)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("/add_face")
# async def add_face(
#     faceLibType: str = Form(...),
#     FDID: str = Form(...),
#     FPID: str = Form(...),
#     name: str = Form(...),
#     gender: str = Form(...),
#     bornTime: str = Form(...),
#     city: str = Form(...),
#     img: UploadFile = File(...)
# ):
#     fd = client.FaceData()
#     host = os.environ.get('HIKVISION_ACT_HOST')

#     # Save uploaded image temporarily
#     tmp_face_path = f"/tmp/{img.filename}"
#     with open(tmp_face_path, "wb") as f:
#         content = await img.read()
#         f.write(content)

#     result = fd.face_data_add(
#         faceLibType,
#         FDID,
#         FPID,
#         name,
#         gender,
#         bornTime,
#         city,
#         faceURL=tmp_face_path,
#         host1=host,
#         host2=host
#     )