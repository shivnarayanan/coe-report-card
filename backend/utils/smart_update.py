from typing import List, Dict, Any, Set, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.inspection import inspect
import models
import audit_logging
from utils.audit_utils import auto_populate_audit_fields


def get_entity_key(entity: Any, key_fields: List[str]) -> str:
    """Generate a unique key for an entity based on specified fields"""
    key_parts = []
    for field in key_fields:
        value = getattr(entity, field, None)
        key_parts.append(str(value) if value is not None else "")
    return "|".join(key_parts)


def compare_and_update_project_tags(
    db: Session,
    project_id: str,
    new_tags: List[Any],
    existing_tags: List[models.ProjectTag]
) -> None:
    """
    Smart update for project tags - only change what's different
    """
    # Create sets of tag values for comparison
    new_tag_values = {tag.tag for tag in new_tags}
    existing_tag_map = {tag.tag: tag for tag in existing_tags if tag.is_active}
    existing_tag_values = set(existing_tag_map.keys())
    
    # Find what needs to be added, removed, or kept
    tags_to_add = new_tag_values - existing_tag_values
    tags_to_remove = existing_tag_values - new_tag_values
    tags_to_keep = new_tag_values & existing_tag_values
    
    # Remove tags that are no longer needed
    for tag_value in tags_to_remove:
        tag_to_remove = existing_tag_map[tag_value]
        audit_logging.log_delete(db, tag_to_remove, context="smart-update")
        tag_to_remove.is_active = False
        auto_populate_audit_fields(tag_to_remove, is_update=True)
    
    # Add new tags
    for tag_value in tags_to_add:
        new_tag = models.ProjectTag(project_id=project_id, tag=tag_value)
        auto_populate_audit_fields(new_tag, is_update=False)
        db.add(new_tag)
        db.flush()  # Flush to get the ID for audit logging
        audit_logging.log_insert(db, new_tag, context="smart-update")
    
    # Tags to keep don't need any changes
    print(f"Tags - Added: {len(tags_to_add)}, Removed: {len(tags_to_remove)}, Kept: {len(tags_to_keep)}")


def compare_and_update_project_individuals(
    db: Session,
    project_id: str,
    new_individuals: List[Any],
    existing_individuals: List[models.ProjectIndividual]
) -> None:
    """
    Smart update for project individuals - only change what's different
    """
    # Create sets of individual names for comparison
    new_individual_names = {individual.name for individual in new_individuals}
    existing_individual_map = {individual.name: individual for individual in existing_individuals if individual.is_active}
    existing_individual_names = set(existing_individual_map.keys())
    
    # Find what needs to be added, removed, or kept
    individuals_to_add = new_individual_names - existing_individual_names
    individuals_to_remove = existing_individual_names - new_individual_names
    individuals_to_keep = new_individual_names & existing_individual_names
    
    # Remove individuals that are no longer needed
    for individual_name in individuals_to_remove:
        individual_to_remove = existing_individual_map[individual_name]
        audit_logging.log_delete(db, individual_to_remove, context="smart-update")
        individual_to_remove.is_active = False
        auto_populate_audit_fields(individual_to_remove, is_update=True)
    
    # Add new individuals
    for individual_name in individuals_to_add:
        new_individual = models.ProjectIndividual(project_id=project_id, name=individual_name)
        auto_populate_audit_fields(new_individual, is_update=False)
        db.add(new_individual)
        db.flush()  # Flush to get the ID for audit logging
        audit_logging.log_insert(db, new_individual, context="smart-update")
    
    # Individuals to keep don't need any changes
    print(f"Individuals - Added: {len(individuals_to_add)}, Removed: {len(individuals_to_remove)}, Kept: {len(individuals_to_keep)}")


def compare_and_update_timeline_items(
    db: Session,
    project_id: str,
    new_timeline_items: List[Any],
    existing_timeline_items: List[models.TimelineItem]
) -> None:
    """
    Smart update for timeline items - only change what's different
    Timeline items are more complex as they have multiple fields that can change
    """
    # Create maps for comparison (using title + date as unique key)
    new_timeline_map = {}
    for item in new_timeline_items:
        key = f"{item.title}|{item.date}"
        new_timeline_map[key] = item
    
    existing_timeline_map = {}
    for item in existing_timeline_items:
        if item.is_active:
            key = f"{item.title}|{item.date}"
            existing_timeline_map[key] = item
    
    new_keys = set(new_timeline_map.keys())
    existing_keys = set(existing_timeline_map.keys())
    
    # Find what needs to be added, removed, or potentially updated
    items_to_add = new_keys - existing_keys
    items_to_remove = existing_keys - new_keys
    items_to_check = new_keys & existing_keys
    
    # Remove timeline items that are no longer needed
    for item_key in items_to_remove:
        item_to_remove = existing_timeline_map[item_key]
        audit_logging.log_delete(db, item_to_remove, context="smart-update")
        item_to_remove.is_active = False
        auto_populate_audit_fields(item_to_remove, is_update=True)
    
    # Add new timeline items
    for item_key in items_to_add:
        new_item_data = new_timeline_map[item_key]
        new_item = models.TimelineItem(
            project_id=project_id,
            title=new_item_data.title,
            description=new_item_data.description,
            date=new_item_data.date,
            is_step_active=new_item_data.is_step_active
        )
        auto_populate_audit_fields(new_item, is_update=False)
        db.add(new_item)
        db.flush()  # Flush to get the ID for audit logging
        audit_logging.log_insert(db, new_item, context="smart-update")
    
    # Check existing items for updates
    items_updated = 0
    for item_key in items_to_check:
        existing_item = existing_timeline_map[item_key]
        new_item_data = new_timeline_map[item_key]
        
        # Capture old data before making changes
        old_data = audit_logging.serialize_object(existing_item)
        needs_update = False
        
        # Check each field for changes
        if existing_item.description != new_item_data.description:
            existing_item.description = new_item_data.description
            needs_update = True
        
        if existing_item.is_step_active != new_item_data.is_step_active:
            existing_item.is_step_active = new_item_data.is_step_active
            needs_update = True
        
        if needs_update:
            auto_populate_audit_fields(existing_item, is_update=True)
            audit_logging.log_update(db, existing_item, old_data, context="smart-update")
            items_updated += 1
    
    print(f"Timeline - Added: {len(items_to_add)}, Removed: {len(items_to_remove)}, Updated: {items_updated}, Kept: {len(items_to_check) - items_updated}")


def has_project_fields_changed(db_project: models.Project, new_project_data: Any) -> bool:
    """
    Check if any of the main project fields have changed
    """
    fields_to_check = [
        'title', 'description', 'status', 'why_we_built_this', 'what_weve_built',
        'nti_status', 'nti_link', 'primary_benefits_category', 'primary_ai_benefit_category',
        'investment_required', 'expected_near_term_benefits', 'expected_long_term_benefits',
        'primary_business_function'
    ]
    
    for field in fields_to_check:
        existing_value = getattr(db_project, field, None)
        new_value = getattr(new_project_data, field, None)
        
        # Handle None values and convert to strings for comparison
        existing_str = str(existing_value) if existing_value is not None else ""
        new_str = str(new_value) if new_value is not None else ""
        
        if existing_str != new_str:
            print(f"Field '{field}' changed: '{existing_str}' -> '{new_str}'")
            return True
    
    return False


def update_project_fields(db_project: models.Project, new_project_data: Any) -> None:
    """
    Update project fields with new values
    """
    db_project.title = new_project_data.title
    db_project.description = new_project_data.description
    db_project.status = new_project_data.status
    db_project.why_we_built_this = new_project_data.why_we_built_this
    db_project.what_weve_built = new_project_data.what_weve_built
    db_project.nti_status = new_project_data.nti_status
    db_project.nti_link = new_project_data.nti_link
    db_project.primary_benefits_category = new_project_data.primary_benefits_category
    db_project.primary_ai_benefit_category = new_project_data.primary_ai_benefit_category
    db_project.investment_required = new_project_data.investment_required
    db_project.expected_near_term_benefits = new_project_data.expected_near_term_benefits
    db_project.expected_long_term_benefits = new_project_data.expected_long_term_benefits
    db_project.primary_business_function = new_project_data.primary_business_function
    auto_populate_audit_fields(db_project, is_update=True)