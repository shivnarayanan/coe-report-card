import json
import sys
import os
from pathlib import Path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine
from models import Project, TimelineItem, ProjectTag, ProjectIndividual, Base
from utils.schema_manager import ensure_schema_exists

data_path = Path(__file__).parent.parent.parent / "public" / "data" / "mockProjects.json"
with open(data_path) as f:
    mock_projects = json.load(f)

# Schema name (should match the one used in models)
SCHEMA_NAME = "registry"

def load_projects():
    # Ensure schema exists and create tables if needed
    if not ensure_schema_exists(engine, SCHEMA_NAME):
        print(f"Failed to ensure schema '{SCHEMA_NAME}' exists")
        return
    
    # Create tables in the schema
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        for proj in mock_projects:
            project = Project(
                id=proj["id"],
                title=proj["title"],
                description=proj["description"],
                status=proj["status"],
                why_we_built_this=proj.get("whyWeBuiltThis"),
                what_weve_built=proj.get("whatWeveBuilt"),
                nti_status=proj.get("ntiStatus"),
                nti_link=proj.get("ntiLink"),
                primary_benefits_category=proj.get("primaryBenefitsCategory"),
                primary_ai_benefit_category=proj.get("primaryAIBenefitCategory"),
                investment_required=proj.get("investmentRequired"),
                expected_near_term_benefits=proj.get("expectedNearTermBenefits"),
                expected_long_term_benefits=proj.get("expectedLongTermBenefits"),
                primary_business_function=proj.get("primaryBusinessFunction"),
            )
            db.add(project)
            db.flush()  # To get project.id if autogen

            for tag in proj.get("tags", []):
                db.add(ProjectTag(project_id=project.id, tag=tag))
            for name in proj.get("individualsInvolved", []):
                db.add(ProjectIndividual(project_id=project.id, name=name))
            for item in proj.get("timeline", []):
                db.add(TimelineItem(
                    project_id=project.id,
                    title=item["title"],
                    description=item["description"],
                    date=item["date"],
                    is_step_active=item["isStepActive"],
                ))
        db.commit()
        print("Mock projects loaded successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    load_projects() 