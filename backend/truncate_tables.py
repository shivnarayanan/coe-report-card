from database import engine, SessionLocal
from models import Project, TimelineItem, ProjectTag, ProjectIndividual
from sqlalchemy import text

# List of table names in order to avoid FK issues (child tables first)
table_names = [
    'timeline_items',
    'project_tags',
    'project_individuals',
    'projects',
]

def truncate_all():
    with engine.connect() as conn:
        # Disable FK checks for MSSQL
        conn.execute(text("EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT all'"))
        for table in table_names:
            conn.execute(text(f"DELETE FROM {table}"))
        # Enable FK checks
        conn.execute(text("EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all'"))
        conn.commit()
    print("All tables truncated.")

if __name__ == "__main__":
    truncate_all() 