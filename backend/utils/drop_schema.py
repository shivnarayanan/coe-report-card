import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from models import Base
from utils.schema_manager import drop_schema_if_exists, schema_exists

# Schema name (should match the one used in models)
SCHEMA_NAME = "registry"

if __name__ == "__main__":
    print(f"Dropping schema '{SCHEMA_NAME}' and all its tables...")
    
    # First check if schema exists
    if not schema_exists(engine, SCHEMA_NAME):
        print(f"Schema '{SCHEMA_NAME}' does not exist. Nothing to drop.")
    else:
        # First drop all tables to remove dependencies
        print(f"Dropping all tables in schema '{SCHEMA_NAME}'...")
        Base.metadata.drop_all(bind=engine)
        print("Tables dropped.")
        
        # Now drop the schema
        print(f"Dropping schema '{SCHEMA_NAME}'...")
        if drop_schema_if_exists(engine, SCHEMA_NAME):
            print(f"Schema '{SCHEMA_NAME}' dropped successfully.")
        else:
            print(f"Failed to drop schema '{SCHEMA_NAME}'.") 