from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from api.services.employee_service import add_employee_service  # ✅ Import service function

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
    img: UploadFile = File(...)
):
    try:
        result = await add_employee_service(empid, email, name, branchname, branchcode, location, mobilenumber, img)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))