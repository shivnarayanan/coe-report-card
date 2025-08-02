import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()
GUID_LENGTH = 36


def gen_uuid() -> str:
    return str(uuid.uuid4())


class AuditMixin:
    """Mixin class to add audit columns to models"""
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_by = Column(String(100), nullable=True)  # Username or user ID
    updated_by = Column(String(100), nullable=True)  # Username or user ID
    is_active = Column(Boolean, default=True, nullable=False)


class Project(Base, AuditMixin):
    __tablename__ = "projects"
    __table_args__ = {"schema": "registry"}

    # use a 36-char UUID rather than VARCHAR(max)
    id = Column(String(GUID_LENGTH), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), nullable=False)

    why_we_built_this = Column(Text)
    what_weve_built = Column(Text)
    nti_status = Column(String(50))
    nti_link = Column(String(2083))

    primary_benefits_category = Column(String(100))
    primary_ai_benefit_category = Column(String(100))
    investment_required = Column(String(100))
    expected_near_term_benefits = Column(String(255))
    expected_long_term_benefits = Column(String(255))
    primary_business_function = Column(String(100))

    # relationships
    timeline = relationship(
        "TimelineItem", back_populates="project", cascade="all, delete-orphan"
    )
    tags = relationship(
        "ProjectTag", back_populates="project", cascade="all, delete-orphan"
    )
    individuals = relationship(
        "ProjectIndividual", back_populates="project", cascade="all, delete-orphan"
    )


class TimelineItem(Base, AuditMixin):
    __tablename__ = "timeline_items"
    __table_args__ = {"schema": "registry"}

    # simple int PK so no VARCHAR(max) problems
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(GUID_LENGTH), ForeignKey("registry.projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(String(50), nullable=False)
    is_step_active = Column(Boolean, default=False)

    project = relationship("Project", back_populates="timeline")


class ProjectTag(Base, AuditMixin):
    __tablename__ = "project_tags"
    __table_args__ = {"schema": "registry"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(GUID_LENGTH), ForeignKey("registry.projects.id"), nullable=False)
    tag = Column(String(50), nullable=False)

    project = relationship("Project", back_populates="tags")


class ProjectIndividual(Base, AuditMixin):
    __tablename__ = "project_individuals"
    __table_args__ = {"schema": "registry"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(GUID_LENGTH), ForeignKey("registry.projects.id"), nullable=False)
    name = Column(String(100), nullable=False)

    project = relationship("Project", back_populates="individuals")


class AuditLog(Base):
    __tablename__ = "audit_log"
    __table_args__ = {"schema": "registry"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_name = Column(String(100), nullable=False)
    row_id = Column(String(GUID_LENGTH), nullable=False)
    action = Column(String(10), nullable=False)  # INSERT, UPDATE, DELETE
    old_data = Column(JSON, nullable=True)
    new_data = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    actor = Column(String(100), default="system", nullable=False)
    context = Column(String(255), nullable=True)  # Additional context like "replace-all", "user-update"
