from pydantic import BaseModel
from typing import List

class TimelineItemSchema(BaseModel):
    title: str
    description: str
    date: str
    is_step_active: bool
    class Config:
        from_attributes = True

class ProjectTagSchema(BaseModel):
    tag: str
    class Config:
        from_attributes = True

class ProjectIndividualSchema(BaseModel):
    name: str
    class Config:
        from_attributes = True

class ProjectSchema(BaseModel):
    id: str
    title: str
    description: str
    status: str
    why_we_built_this: str = None
    what_weve_built: str = None
    nti_status: str = None
    nti_link: str = None
    primary_benefits_category: str = None
    primary_ai_benefit_category: str = None
    investment_required: str = None
    expected_near_term_benefits: str = None
    expected_long_term_benefits: str = None
    primary_business_function: str = None
    timeline: List[TimelineItemSchema] = []
    tags: List[ProjectTagSchema] = []
    individuals: List[ProjectIndividualSchema] = []
    class Config:
        from_attributes = True

class ProjectCreateSchema(BaseModel):
    id: str
    title: str
    description: str
    status: str
    why_we_built_this: str = None
    what_weve_built: str = None
    nti_status: str = None
    nti_link: str = None
    primary_benefits_category: str = None
    primary_ai_benefit_category: str = None
    investment_required: str = None
    expected_near_term_benefits: str = None
    expected_long_term_benefits: str = None
    primary_business_function: str = None
    timeline: List[TimelineItemSchema] = []
    tags: List[ProjectTagSchema] = []
    individuals: List[ProjectIndividualSchema] = []
    class Config:
        from_attributes = True 