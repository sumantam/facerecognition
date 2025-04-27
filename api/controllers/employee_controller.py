import asyncio
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from api.services.employee_service import add_employee_service  # ✅ Import service function
import threading
# import os


# ✅ Create API Router
router = APIRouter()

# ✅ Add a New User (Call Stored Procedure)
@router.post("/employees")
async def add_employee(
    empid: int = Form(...),
    email: str = Form(...),
    name: str = Form(...),
    branchname: str = Form(...),
    branchcode: int = Form(...),
    location: str = Form(...),
    mobilenumber: str = Form(...),
    gender: str = Form(...),
    DOB: str = Form(...),
    img: UploadFile = File(...)
):
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