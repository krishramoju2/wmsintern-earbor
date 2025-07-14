from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date

def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employee_by_driving_license(db: Session, driving_license_number: str):
    return db.query(models.Employee).filter(models.Employee.driving_license_number == driving_license_number).first()

def get_employee_by_aadhar(db: Session, aadhar_number: str):
    return db.query(models.Employee).filter(models.Employee.aadhar_number == aadhar_number).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def create_document(db: Session, document: schemas.DocumentCreate):
    db_document = models.Document(**document.dict())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

def get_documents_by_employee(db: Session, employee_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Document).filter(models.Document.employee_id == employee_id).offset(skip).limit(limit).all()

def get_total_truckers_registered(db: Session):
    return db.query(models.Employee).count()

def get_total_trucking_documents_uploaded(db: Session):
    return db.query(models.Document).count()
