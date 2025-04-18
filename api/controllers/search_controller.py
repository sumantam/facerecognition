from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from api.services.search_service import search_all_employee_service  # ✅ Import service function

# ✅ Create API Router
router = APIRouter()

# ✅ Find  all new Users
@router.get("/users/allUsers")
async def all_employee():
    try:
        result = await search_all_employee_service()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))