from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
import models
import uvicorn
from database import SessionLocal, engine
from schemas import ProjectSchema, ProjectCreateSchema, TimelineItemSchema, ProjectTagSchema, ProjectIndividualSchema
from audit_utils import auto_populate_audit_fields, get_active_only_filter, soft_delete

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

@app.get("/projects")
def read_api_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).filter(get_active_only_filter(models.Project)).all()
    
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
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        get_active_only_filter(models.Project)
    ).first()
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
    auto_populate_audit_fields(db_project, is_update=False)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Add tags
    for tag_data in project.tags:
        db_tag = models.ProjectTag(project_id=db_project.id, tag=tag_data.tag)
        auto_populate_audit_fields(db_tag, is_update=False)
        db.add(db_tag)
    
    # Add individuals
    for individual_data in project.individuals:
        db_individual = models.ProjectIndividual(project_id=db_project.id, name=individual_data.name)
        auto_populate_audit_fields(db_individual, is_update=False)
        db.add(db_individual)
    
    # Add timeline items
    for timeline_data in project.timeline:
        db_timeline = models.TimelineItem(
            project_id=db_project.id,
            title=timeline_data.title,
            description=timeline_data.description,
            date=timeline_data.date,
            is_step_active=timeline_data.is_step_active
        )
        auto_populate_audit_fields(db_timeline, is_update=False)
        db.add(db_timeline)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/projects/{project_id}", response_model=ProjectSchema)
def update_project(project_id: str, project: ProjectCreateSchema, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(
        models.Project.id == project_id,
        get_active_only_filter(models.Project)
    ).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update project fields
    db_project.title = project.title
    db_project.description = project.description
    db_project.status = project.status
    db_project.why_we_built_this = project.why_we_built_this
    db_project.what_weve_built = project.what_weve_built
    db_project.nti_status = project.nti_status
    db_project.nti_link = project.nti_link
    db_project.primary_benefits_category = project.primary_benefits_category
    db_project.primary_ai_benefit_category = project.primary_ai_benefit_category
    db_project.investment_required = project.investment_required
    db_project.expected_near_term_benefits = project.expected_near_term_benefits
    db_project.expected_long_term_benefits = project.expected_long_term_benefits
    db_project.primary_business_function = project.primary_business_function
    auto_populate_audit_fields(db_project, is_update=True)
    
    # Delete existing related data
    db.query(models.ProjectTag).filter(models.ProjectTag.project_id == project_id).delete()
    db.query(models.ProjectIndividual).filter(models.ProjectIndividual.project_id == project_id).delete()
    db.query(models.TimelineItem).filter(models.TimelineItem.project_id == project_id).delete()
    
    # Add new tags
    for tag_data in project.tags:
        db_tag = models.ProjectTag(project_id=project_id, tag=tag_data.tag)
        auto_populate_audit_fields(db_tag, is_update=False)
        db.add(db_tag)
    
    # Add new individuals
    for individual_data in project.individuals:
        db_individual = models.ProjectIndividual(project_id=project_id, name=individual_data.name)
        auto_populate_audit_fields(db_individual, is_update=False)
        db.add(db_individual)
    
    # Add new timeline items
    for timeline_data in project.timeline:
        db_timeline = models.TimelineItem(
            project_id=project_id,
            title=timeline_data.title,
            description=timeline_data.description,
            date=timeline_data.date,
            is_step_active=timeline_data.is_step_active
        )
        auto_populate_audit_fields(db_timeline, is_update=False)
        db.add(db_timeline)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Soft delete a project by setting is_active to False"""
    db_project = db.query(models.Project).filter(
        models.Project.id == project_id,
        get_active_only_filter(models.Project)
    ).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Soft delete the project and all related items
    soft_delete(db, db_project)
    
    # Also soft delete related items
    for tag in db_project.tags:
        if tag.is_active:
            soft_delete(db, tag)
    
    for individual in db_project.individuals:
        if individual.is_active:
            soft_delete(db, individual)
    
    for timeline_item in db_project.timeline:
        if timeline_item.is_active:
            soft_delete(db, timeline_item)
    
    return {"message": "Project deleted successfully"}

@app.get("/analytics/overview")
def get_analytics_overview(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get dashboard overview metrics"""
    
    # Total projects count (active only)
    total_projects = db.query(models.Project).filter(get_active_only_filter(models.Project)).count()
    
    # Projects by status (active only)
    projects_by_status = db.query(
        models.Project.status, 
        func.count(models.Project.id).label('count')
    ).filter(get_active_only_filter(models.Project)).group_by(models.Project.status).all()
    
    # Projects by business function (active only)
    projects_by_function = db.query(
        models.Project.primary_business_function, 
        func.count(models.Project.id).label('count')
    ).filter(
        models.Project.primary_business_function.isnot(None),
        get_active_only_filter(models.Project)
    ).group_by(
        models.Project.primary_business_function
    ).all()
    
    # Projects by benefits category (active only)
    projects_by_benefits = db.query(
        models.Project.primary_benefits_category, 
        func.count(models.Project.id).label('count')
    ).filter(
        models.Project.primary_benefits_category.isnot(None),
        get_active_only_filter(models.Project)
    ).group_by(
        models.Project.primary_benefits_category
    ).all()
    
    # Projects by AI benefit category (active only)
    projects_by_ai_benefits = db.query(
        models.Project.primary_ai_benefit_category, 
        func.count(models.Project.id).label('count')
    ).filter(
        models.Project.primary_ai_benefit_category.isnot(None),
        get_active_only_filter(models.Project)
    ).group_by(
        models.Project.primary_ai_benefit_category
    ).all()
    
    # Count active timeline items (from active projects only)
    active_milestones = db.query(models.TimelineItem).join(models.Project).filter(
        models.TimelineItem.is_step_active == True,
        get_active_only_filter(models.TimelineItem),
        get_active_only_filter(models.Project)
    ).count()
    
    # Most used tags (from active projects only)
    top_tags = db.query(
        models.ProjectTag.tag, 
        func.count(models.ProjectTag.tag).label('count')
    ).join(models.Project).filter(
        get_active_only_filter(models.ProjectTag),
        get_active_only_filter(models.Project)
    ).group_by(models.ProjectTag.tag).order_by(
        func.count(models.ProjectTag.tag).desc()
    ).limit(10).all()
    
    return {
        "totalProjects": total_projects,
        "activeMilestones": active_milestones,
        "projectsByStatus": [{"status": row.status, "count": row.count} for row in projects_by_status],
        "projectsByFunction": [{"function": row.primary_business_function, "count": row.count} for row in projects_by_function],
        "projectsByBenefits": [{"category": row.primary_benefits_category, "count": row.count} for row in projects_by_benefits],
        "projectsByAIBenefits": [{"category": row.primary_ai_benefit_category, "count": row.count} for row in projects_by_ai_benefits],
        "topTags": [{"tag": row.tag, "count": row.count} for row in top_tags]
    }

@app.get("/analytics/timeline")
def get_timeline_analytics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get timeline and progress analytics"""
    
    # Timeline items grouped by month (active only)
    timeline_items = db.query(models.TimelineItem).join(models.Project).filter(
        get_active_only_filter(models.TimelineItem),
        get_active_only_filter(models.Project)
    ).all()
    
    # Group timeline items by project and status (active projects only)
    project_progress = []
    projects = db.query(models.Project).filter(get_active_only_filter(models.Project)).all()
    
    for project in projects:
        total_items = len(project.timeline)
        active_items = sum(1 for item in project.timeline if item.is_step_active)
        completed_items = total_items - active_items
        
        project_progress.append({
            "projectId": project.id,
            "projectTitle": project.title,
            "status": project.status,
            "totalMilestones": total_items,
            "activeMilestones": active_items,
            "completedMilestones": completed_items,
            "progressPercentage": (completed_items / total_items * 100) if total_items > 0 else 0
        })
    
    return {
        "projectProgress": project_progress,
        "totalTimelineItems": len(timeline_items)
    }
    
if __name__ == '__main__':
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8002,
        reload=True,
        log_level="info"
    )