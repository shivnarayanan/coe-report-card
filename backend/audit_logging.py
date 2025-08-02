from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy.inspection import inspect
from models import AuditLog


def setup_audit_logging():
    """Initialize audit logging system"""
    pass


def serialize_object(obj: Any) -> Dict[str, Any]:
    """Convert SQLAlchemy object to dictionary for JSON storage"""
    if obj is None:
        return None
    
    # Get the mapper for the object to access column properties
    mapper = inspect(obj.__class__)
    data = {}
    
    for column in mapper.columns:
        value = getattr(obj, column.key)
        # Handle datetime objects
        if isinstance(value, datetime):
            data[column.key] = value.isoformat()
        else:
            data[column.key] = value
    
    return data


def log_audit_change(
    db: Session,
    table_name: str,
    row_id: str,
    action: str,
    old_data: Optional[Dict[str, Any]] = None,
    new_data: Optional[Dict[str, Any]] = None,
    actor: str = "system",
    context: Optional[str] = None
) -> None:
    """
    Log an audit change to the audit_log table.
    
    Args:
        db: SQLAlchemy session
        table_name: Name of the affected table
        row_id: Primary key of the changed row
        action: Type of action (INSERT, UPDATE, DELETE)
        old_data: JSON snapshot before the change (for UPDATE/DELETE)
        new_data: JSON snapshot after the change (for INSERT/UPDATE)
        actor: Who performed the action (defaults to "system")
    """
    audit_log = AuditLog(
        table_name=table_name,
        row_id=str(row_id),
        action=action.upper(),
        old_data=old_data,
        new_data=new_data,
        timestamp=datetime.now(timezone.utc),
        actor=actor,
        context=context
    )
    
    db.add(audit_log)
    db.commit()


def log_insert(
    db: Session,
    obj: Any,
    actor: str = "system",
    context: Optional[str] = None
) -> None:
    """
    Log an INSERT operation.
    
    Args:
        db: SQLAlchemy session
        obj: The SQLAlchemy object that was inserted
        actor: Who performed the action
    """
    table_name = obj.__tablename__
    row_id = get_primary_key_value(obj)
    new_data = serialize_object(obj)
    
    log_audit_change(
        db=db,
        table_name=table_name,
        row_id=row_id,
        action="INSERT",
        old_data=None,
        new_data=new_data,
        actor=actor,
        context=context
    )


def log_update(
    db: Session,
    obj: Any,
    old_obj_data: Dict[str, Any],
    actor: str = "system",
    context: Optional[str] = None
) -> None:
    """
    Log an UPDATE operation.
    
    Args:
        db: SQLAlchemy session
        obj: The SQLAlchemy object after update
        old_obj_data: Dictionary containing the old object data before update
        actor: Who performed the action
    """
    table_name = obj.__tablename__
    row_id = get_primary_key_value(obj)
    new_data = serialize_object(obj)
    
    log_audit_change(
        db=db,
        table_name=table_name,
        row_id=row_id,
        action="UPDATE",
        old_data=old_obj_data,
        new_data=new_data,
        actor=actor,
        context=context
    )


def log_delete(
    db: Session,
    obj: Any,
    actor: str = "system",
    context: Optional[str] = None
) -> None:
    """
    Log a DELETE operation.
    
    Args:
        db: SQLAlchemy session
        obj: The SQLAlchemy object before deletion
        actor: Who performed the action
    """
    table_name = obj.__tablename__
    row_id = get_primary_key_value(obj)
    old_data = serialize_object(obj)
    
    log_audit_change(
        db=db,
        table_name=table_name,
        row_id=row_id,
        action="DELETE",
        old_data=old_data,
        new_data=None,
        actor=actor,
        context=context
    )


def get_primary_key_value(obj: Any) -> str:
    """
    Get the primary key value of a SQLAlchemy object.
    
    Args:
        obj: SQLAlchemy object
        
    Returns:
        Primary key value as string
    """
    mapper = inspect(obj.__class__)
    primary_key_columns = mapper.primary_key
    
    if len(primary_key_columns) == 1:
        # Single primary key
        pk_column = primary_key_columns[0]
        return str(getattr(obj, pk_column.key))
    else:
        # Composite primary key - concatenate with separator
        pk_values = []
        for pk_column in primary_key_columns:
            pk_values.append(str(getattr(obj, pk_column.key)))
        return "|".join(pk_values)