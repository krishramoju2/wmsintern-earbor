from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware # <<< ADDED THIS IMPORT
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine, get_db
from datetime import date
import os
import shutil

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Warehouse & Trucker Management API",
    description="Manage employee data, trucker profiles, and critical logistics documents efficiently."
)

# <<< ADDED CORS CONFIGURATION HERE
# CORS Configuration
# IMPORTANT: Replace "https://YOUR_VERCEL_DOMAIN.vercel.app" with your actual Vercel domain!
# For example, if your Vercel URL is https://wmsintern-earbor.vercel.app, use that.
origins = [
    "http://localhost:3000",  # Your React development server for local testing
    "http://127.0.0.1:3000",  # Another common local React development address
    "https://YOUR_VERCEL_DOMAIN.vercel.app", # Your actual Vercel frontend domain
    "https://YOUR_VERCEL_DOMAIN.vercel.app/api" # Often beneficial to include this too
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Specifies allowed origins
    allow_credentials=True,      # Allows cookies to be sent
    allow_methods=["*"],         # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],         # Allows all headers (e.g., Content-Type, Authorization)
)
# >>> END CORS CONFIGURATION

# Placeholder for file storage. In a real app, use cloud storage like AWS S3 or Google Cloud Storage.
# NOTE: This local storage method is NOT suitable for Vercel's ephemeral serverless environment.
# You will need to integrate with a cloud storage service for production file uploads.
UPLOAD_DIRECTORY = "uploaded_documents"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@app.post("/employees/", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee_dl = crud.get_employee_by_driving_license(db, employee.driving_license_number)
    if db_employee_dl:
        raise HTTPException(status_code=400, detail="Driving License Number already registered")
    db_employee_aadhar = crud.get_employee_by_aadhar(db, employee.aadhar_number)
    if db_employee_aadhar:
        raise HTTPException(status_code=400, detail="Aadhar Number already registered")
    return crud.create_employee(db=db, employee=employee)

@app.get("/employees/", response_model=list[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = crud.get_employees(db, skip=skip, limit=limit)
    return employees

@app.get("/employees/{employee_id}", response_model=schemas.Employee)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@app.post("/documents/", response_model=schemas.Document, status_code=status.HTTP_201_CREATED)
async def upload_document(
    employee_id: int,
    document_type: str, # Consider using an Enum for document types
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Basic check for employee existence
    db_employee = crud.get_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found. Cannot upload document.")

    # Save the file to a local directory (for demonstration)
    # In production, use cloud storage (e.g., AWS S3, Google Cloud Storage) and store the URL.
    # THIS PART WILL NOT WORK ON VERCEL AS THE FILESYSTEM IS EPHEMERAL.
    # YOU NEED TO CHANGE THIS TO UPLOAD TO A CLOUD STORAGE SERVICE.
    file_location = os.path.join(UPLOAD_DIRECTORY, f"{employee_id}_{document_type}_{file.filename}")
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document_create = schemas.DocumentCreate(
        employee_id=employee_id,
        document_type=document_type,
        file_path=file_location, # Store the actual path or URL
        uploaded_at=date.today()
    )
    return crud.create_document(db=db, document=document_create)

@app.get("/documents/{employee_id}", response_model=list[schemas.Document])
def get_employee_documents(employee_id: int, db: Session = Depends(get_db)):
    documents = crud.get_documents_by_employee(db, employee_id)
    if not documents:
        raise HTTPException(status_code=404, detail="No documents found for this employee")
    return documents

@app.post("/search_truckers/", response_model=list[schemas.Employee])
def search_truckers(search_query: schemas.TruckerSearch, db: Session = Depends(get_db)):
    employees = []
    if search_query.driver_id:
        employee = crud.get_employee_by_driving_license(db, search_query.driver_id)
        if employee:
            employees.append(employee)
    if search_query.employee_id:
        employee = crud.get_employee(db, search_query.employee_id)
        if employee:
            employees.append(employee)
    # Remove duplicates if both fields are provided and match the same employee
    unique_employees = list({emp.id: emp for emp in employees}.values())
    return unique_employees

@app.get("/dashboard/total_truckers")
def get_total_truckers(db: Session = Depends(get_db)):
    total = crud.get_total_truckers_registered(db)
    return {"total_truckers_registered": total}

@app.get("/dashboard/total_documents")
def get_total_documents(db: Session = Depends(get_db)):
    total = crud.get_total_trucking_documents_uploaded(db)
    return {"total_trucking_documents_uploaded": total}
