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
        print(f"Dropping all tables in schema '{SCHEMA_NAME}'...")
        
        try:
            # Import text for raw SQL execution
            from sqlalchemy import text
            
            with engine.begin() as conn:  # Use begin() for automatic transaction handling
                # First, drop all foreign key constraints in the schema
                print("Dropping foreign key constraints...")
                fk_result = conn.execute(text(f"""
                    SELECT 
                        CONSTRAINT_NAME,
                        TABLE_NAME
                    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
                    WHERE TABLE_SCHEMA = '{SCHEMA_NAME}'
                    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                """))
                
                foreign_keys = fk_result.fetchall()
                for fk_name, table_name in foreign_keys:
                    try:
                        conn.execute(text(f"ALTER TABLE [{SCHEMA_NAME}].[{table_name}] DROP CONSTRAINT [{fk_name}]"))
                        print(f"Dropped FK constraint: {fk_name} from {table_name}")
                    except Exception as e:
                        print(f"Error dropping FK constraint {fk_name}: {e}")
                
                # Now get all tables in the schema and drop them
                print("Finding all tables in schema...")
                result = conn.execute(text(f"""
                    SELECT TABLE_NAME 
                    FROM INFORMATION_SCHEMA.TABLES 
                    WHERE TABLE_SCHEMA = '{SCHEMA_NAME}'
                    ORDER BY TABLE_NAME
                """))
                
                tables = [row[0] for row in result.fetchall()]
                print(f"Found tables: {tables}")
                
                # Drop each table individually
                for table_name in tables:
                    try:
                        conn.execute(text(f"DROP TABLE [{SCHEMA_NAME}].[{table_name}]"))
                        print(f"Dropped table: {table_name}")
                    except Exception as e:
                        print(f"Error dropping table {table_name}: {e}")
            
            print("All tables dropped.")
            
        except Exception as e:
            print(f"Error during table drop process: {e}")
        
        # Now drop the schema
        print(f"Dropping schema '{SCHEMA_NAME}'...")
        if drop_schema_if_exists(engine, SCHEMA_NAME):
            print(f"Schema '{SCHEMA_NAME}' dropped successfully.")
        else:
            print(f"Failed to drop schema '{SCHEMA_NAME}'.") 