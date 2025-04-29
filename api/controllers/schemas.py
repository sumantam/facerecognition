from pydantic import BaseModel
from typing import Optional, List

class Relation(BaseModel):
    mgrList: Optional[List[str]]
    reporteeList: Optional[List[str]]

class BasicInfo(BaseModel):
    name: str
    role: str
    empid: str
    branchname: str
    branchcode: str
    location: str
    mobileNumber: str
    email: str
    password: Optional[str] = ""
    designation: Optional[str] = None
    responsibility: Optional[str] = None
    gender: Optional[str] = None
    DOB: str  # 👈 Add DOB here

class EmployeeData(BaseModel):
    # basic: BasicInfo
    # relation: Optional[Relation] = None
    # DOB: str
    # img: Optional[str]  # later you'll replace it with proper UploadFile handling
    basic: BasicInfo
    # img: Optional[str]
    relation: Optional[dict]

class EmployeeCreateWrapper(BaseModel):
    data: EmployeeData
