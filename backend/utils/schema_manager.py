from sqlalchemy import text, inspect
from sqlalchemy.orm import Session
from sqlalchemy.engine import Engine
import logging

logger = logging.getLogger(__name__)

def schema_exists(engine: Engine, schema_name: str) -> bool:
    """
    Check if a specific schema exists in the connected database.
    
    Args:
        engine: SQLAlchemy engine instance
        schema_name: Name of the schema to check
    
    Returns:
        bool: True if schema exists, False otherwise
    """
    try:
        inspector = inspect(engine)
        # For SQL Server, get schema names
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT SCHEMA_NAME 
                FROM INFORMATION_SCHEMA.SCHEMATA 
                WHERE SCHEMA_NAME = :schema_name
            """), {"schema_name": schema_name})
            return result.fetchone() is not None
    except Exception as e:
        logger.error(f"Error checking if schema '{schema_name}' exists: {e}")
        return False

def create_schema_if_not_exists(engine: Engine, schema_name: str) -> bool:
    """
    Create a schema if it doesn't exist.
    
    Args:
        engine: SQLAlchemy engine instance
        schema_name: Name of the schema to create
    
    Returns:
        bool: True if schema was created or already exists, False if creation failed
    """
    try:
        if schema_exists(engine, schema_name):
            logger.info(f"Schema '{schema_name}' already exists")
            return True
        
        with engine.connect() as conn:
            conn.execute(text(f"CREATE SCHEMA [{schema_name}]"))
            conn.commit()
            logger.info(f"Schema '{schema_name}' created successfully")
            return True
    except Exception as e:
        logger.error(f"Error creating schema '{schema_name}': {e}")
        return False

def drop_schema_if_exists(engine: Engine, schema_name: str) -> bool:
    """
    Drop a schema if it exists.
    
    Args:
        engine: SQLAlchemy engine instance
        schema_name: Name of the schema to drop
    
    Returns:
        bool: True if schema was dropped or doesn't exist, False if drop failed
    """
    try:
        if not schema_exists(engine, schema_name):
            logger.info(f"Schema '{schema_name}' does not exist, nothing to drop")
            return True
        
        with engine.connect() as conn:
            conn.execute(text(f"DROP SCHEMA [{schema_name}]"))
            conn.commit()
            logger.info(f"Schema '{schema_name}' dropped successfully")
            return True
    except Exception as e:
        logger.error(f"Error dropping schema '{schema_name}': {e}")
        return False

def ensure_schema_exists(engine: Engine, schema_name: str) -> bool:
    """
    Ensure a schema exists in the database. Create it if it doesn't exist.
    
    Args:
        engine: SQLAlchemy engine instance
        schema_name: Name of the schema to ensure exists
    
    Returns:
        bool: True if schema exists or was created successfully, False otherwise
    """
    logger.info(f"Ensuring schema '{schema_name}' exists...")
    
    if schema_exists(engine, schema_name):
        logger.info(f"Schema '{schema_name}' already exists")
        return True
    
    logger.info(f"Schema '{schema_name}' does not exist, creating...")
    return create_schema_if_not_exists(engine, schema_name)