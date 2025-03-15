from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from api.services.branch_service import add_branch_service  # ✅ Import service function
from pydantic import BaseModel

class Branch(BaseModel):
    branchid: int
    branchname: str
    location: str
    branchaddress: str
    branchmedium: str

# ✅ Create API Router
router = APIRouter()

# ✅ Add a New User (Call Stored Procedure)
@router.post("/branches")
async def add_branch(
    branch:Branch
):
    try:
        result = await add_branch_service(
            branch.branchid, 
            branch.branchname, 
            branch.location,
            branch.branchaddress,
            branch.branchmedium
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))