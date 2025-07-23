from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
from database import SessionLocal, engine
from schemas import ProjectSchema, ProjectCreateSchema, TimelineItemSchema, ProjectTagSchema, ProjectIndividualSchema

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/projects", response_model=List[ProjectSchema])
def read_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.get("/api/projects")
def read_api_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()
    
    # Transform to match frontend format
    transformed_projects = []
    for project in projects:
        # Convert tags from relationship to simple list
        tags = [tag.tag for tag in project.tags]
        
        # Convert individuals to match frontend format
        individuals_involved = [individual.name for individual in project.individuals]
        
        # Convert timeline items to match frontend format
        timeline = []
        for item in project.timeline:
            timeline.append({
                "title": item.title,
                "description": item.description,
                "date": item.date,
                "isStepActive": item.is_step_active
            })
        
        # Create project dict matching frontend structure
        project_dict = {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "status": project.status,
            "tags": tags,
            "whyWeBuiltThis": project.why_we_built_this or "",
            "whatWeveBuilt": project.what_weve_built or "",
            "individualsInvolved": individuals_involved,
            "timeline": timeline,
            "ntiStatus": project.nti_status or "",
            "ntiLink": project.nti_link or "",
            "primaryBenefitsCategory": project.primary_benefits_category or "",
            "primaryAIBenefitCategory": project.primary_ai_benefit_category or "",
            "investmentRequired": project.investment_required or "",
            "expectedNearTermBenefits": project.expected_near_term_benefits or "",
            "expectedLongTermBenefits": project.expected_long_term_benefits or "",
            "primaryBusinessFunction": project.primary_business_function or ""
        }
        transformed_projects.append(project_dict)
    
    return transformed_projects

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