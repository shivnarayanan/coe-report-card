from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from models import AuditMixin


def set_audit_fields(obj: AuditMixin, user_id: Optional[str] = None, is_update: bool = False):
    """Set audit fields on a model instance"""
    now = datetime.utcnow()
    
    if not is_update:
        # Creating new record
        obj.created_at = now
        obj.created_by = user_id
        obj.is_active = True
    
    # Always update these on create or update
    obj.updated_at = now
    obj.updated_by = user_id


def get_current_user_id() -> Optional[str]:
    """Get current user ID - this is a placeholder for now
    In a real application, you would get this from authentication context
    """
    # For now, return a default user identifier
    # You can modify this to integrate with your authentication system
    return "system"


def auto_populate_audit_fields(db_obj: AuditMixin, is_update: bool = False, user_id: Optional[str] = None):
    """Automatically populate audit fields with current user and timestamp"""
    if user_id is None:
        user_id = get_current_user_id()
    
    set_audit_fields(db_obj, user_id, is_update)


def soft_delete(db: Session, obj: AuditMixin, user_id: Optional[str] = None):
    """Soft delete an object by setting is_active to False"""
    if user_id is None:
        user_id = get_current_user_id()
    
    obj.is_active = False
    obj.updated_at = datetime.utcnow()
    obj.updated_by = user_id
    db.commit()


def get_active_only_filter(model_class):
    """Get filter condition for active records only"""
    return model_class.is_active == True