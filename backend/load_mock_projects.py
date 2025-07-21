from database import SessionLocal
from models import Project, TimelineItem, ProjectTag, ProjectIndividual

# Converted mockProjects data from TypeScript to Python
mock_projects = [
    {
        "id": "1",
        "title": "Project Alpha",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "status": "PROOF-OF-CONCEPT",
        "tags": ["Compliance", "IWM"],
        "whyWeBuiltThis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "whatWeveBuilt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "individualsInvolved": [
            "Shiv Narayanan (Chief Data Office/SG)",
            "Lim Zhao Yu (Chief Data Office/SG)",
        ],
        "timeline": [
            {
                "title": "Project Kickoff",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "January 15, 2024",
                "isStepActive": False,
            },
            {
                "title": "Development Phase",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "February 15, 2024",
                "isStepActive": True,
            },
            {
                "title": "Final Testing & QA",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "March 10, 2024",
                "isStepActive": False,
            },
            {
                "title": "Production Deployment",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "March 20, 2024",
                "isStepActive": False,
            },
        ],
        "ntiStatus": "Completed",
        "ntiLink": "https://example.com/nti/project-alpha",
        "primaryBenefitsCategory": "Employee Productivity",
        "primaryAIBenefitCategory": "Knowledge Management",
        "investmentRequired": "USD100,000",
        "expectedNearTermBenefits": "USD30,000",
        "expectedLongTermBenefits": "USD150,000",
        "primaryBusinessFunction": "Finance",
    },
    {
        "id": "2",
        "title": "Project Beta",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "status": "PILOT",
        "tags": ["Investment Banking"],
        "whyWeBuiltThis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "whatWeveBuilt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "individualsInvolved": [
            "Shiv Narayanan (Chief Data Office/SG)",
            "Lim Zhao Yu (Chief Data Office/SG)",
        ],
        "timeline": [
            {
                "title": "Project Initiation",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "February 1, 2024",
                "isStepActive": False,
            },
            {
                "title": "MVP Development",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "February 28, 2024",
                "isStepActive": True,
            },
            {
                "title": "Pilot Testing",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "March 15, 2024",
                "isStepActive": False,
            },
        ],
        "ntiStatus": "In-Progress",
        "ntiLink": "https://example.com/nti/project-beta",
        "primaryBenefitsCategory": "Cost Avoidance",
        "primaryAIBenefitCategory": "Process or Workflow Automation",
        "investmentRequired": "USD50,000",
        "expectedNearTermBenefits": "USD10,000",
        "expectedLongTermBenefits": "USD60,000",
        "primaryBusinessFunction": "IT",
    },
    {
        "id": "3",
        "title": "Project Gamma",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "status": "IDEATION",
        "tags": ["Finance"],
        "whyWeBuiltThis": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "whatWeveBuilt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "individualsInvolved": [],
        "timeline": [
            {
                "title": "Project Launch",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "January 1, 2024",
                "isStepActive": False,
            },
            {
                "title": "Development Completion",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "January 30, 2024",
                "isStepActive": False,
            },
            {
                "title": "User Acceptance Testing",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "February 20, 2024",
                "isStepActive": True,
            },
            {
                "title": "Full Deployment",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "March 1, 2024",
                "isStepActive": False,
            },
            {
                "title": "Maintenance Mode",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
                "date": "March 25, 2024",
                "isStepActive": False,
            },
        ],
        "ntiStatus": "Not Applicable",
        "ntiLink": "",
        "primaryBenefitsCategory": "Revenue Generation",
        "primaryAIBenefitCategory": "Content Generation",
        "investmentRequired": "USD200,000",
        "expectedNearTermBenefits": "USD40,000",
        "expectedLongTermBenefits": "USD250,000",
        "primaryBusinessFunction": "Operations",
    },
]

def load_projects():
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