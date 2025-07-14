from sqlalchemy import Column, Integer, String, Date
from .database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    dob = Column(Date)
    home_address = Column(String)
    contact_number = Column(String)
    driving_license_number = Column(String, unique=True, index=True)
    aadhar_number = Column(String, unique=True, index=True)

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, index=True) # Foreign key to Employee
    document_type = Column(String, index=True) # e.g., "driving_license", "truck_id", "vehicle_logbook"
    file_path = Column(String) # Path to the stored document (e.g., in a cloud storage)
    uploaded_at = Column(Date) # Use DateTime for more precision, but Date is fine for now
