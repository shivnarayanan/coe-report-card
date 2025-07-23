from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
from database import SessionLocal, engine
from schemas import ProjectSchema, ProjectCreateSchema, TimelineItemSchema, ProjectTagSchema, ProjectIndividualSchema

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/projects", response_model=List[ProjectSchema])
def read_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.get("/projects/{project_id}", response_model=ProjectSchema)
def read_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/projects", response_model=ProjectSchema)
def create_project(project: ProjectCreateSchema, db: Session = Depends(get_db)):
    db_project = models.Project(
        id=project.id,
        title=project.title,
        description=project.description,
        status=project.status,
        why_we_built_this=project.why_we_built_this,
        what_weve_built=project.what_weve_built,
        nti_status=project.nti_status,
        nti_link=project.nti_link,
        primary_benefits_category=project.primary_benefits_category,
        primary_ai_benefit_category=project.primary_ai_benefit_category,
        investment_required=project.investment_required,
        expected_near_term_benefits=project.expected_near_term_benefits,
        expected_long_term_benefits=project.expected_long_term_benefits,
        primary_business_function=project.primary_business_function,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project 