from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from api.services.device_service import add_device_service  # ✅ Import service function
from pydantic import BaseModel

class Device(BaseModel):
    deviceid: int
    branchname: str
    branchcode: int
    deviceserialno: str
    devicemodel: str
    deviceip: str
    location: str
    devicestatus: str

# ✅ Create API Router
router = APIRouter()

# ✅ Add a New User (Call Stored Procedure)
@router.post("/devices")
async def add_device(device: Device):
    try:
        result = await add_device_service(
            device.deviceid, 
            device.branchname, 
            device.branchcode, 
            device.deviceserialno,
            device.devicemodel,
            device.deviceip,
            device.location, 
            device.devicestatus
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))