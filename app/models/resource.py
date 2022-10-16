from email.policy import default
from enum import Enum, unique
from operator import index
from sqlalchemy import JSON, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, validates
from app.models.department import Department
from .app_model import AppModel
from app import descriptors

class ResourceOperation(Enum):
    PUSH = "PUSH"
    POP = "POP"
    SET = "SET"
    REMOVE = "REMOVE"
    REPORT = "REPORT"
    LOCK = "LOCK"
    UNLOCK = "UNLOCK"


class Resource(AppModel):
    __tablename__ = "resources"


    code = Column(String, nullable=False, index=True)
    params = Column(String, nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department: Department = relationship("Department")
    amount = Column(Integer, default=0)
    jsondata = Column(JSON, default=dict)

    @validates('code', 'params')
    def convert_upper(self, key, value):
        return value.upper()

    class Meta:
        pass    
     