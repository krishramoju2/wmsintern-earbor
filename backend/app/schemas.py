from pydantic import BaseModel
from datetime import date
from typing import Optional

class EmployeeBase(BaseModel):
    name: str
    dob: date
    home_address: str
    contact_number: str
    driving_license_number: str
    aadhar_number: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        orm_mode = True

class DocumentBase(BaseModel):
    employee_id: int
    document_type: str
    file_path: str # In a real app, this would be a reference to a cloud storage URL
    uploaded_at: date

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int

    class Config:
        orm_mode = True

class TruckerSearch(BaseModel):
    driver_id: Optional[str] = None
    employee_id: Optional[int] = None
