from enum import unique
from operator import index
from sqlalchemy import JSON, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, validates
from app.models.department import Department
from .app_model import AppModel
from app import descriptors

class Resource(AppModel):
    __tablename__ = "resources"


    code = Column(String, max_length=50, db_index=True)
    params = Column(String, max_length=300, db_index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department: Department = relationship("Department")
    amount = Column(Integer)
    jsondata = Column(JSON, default=dict)

    @validates('code', 'params')
    def convert_upper(self, key, value):
        return value.upper()

    class Meta:
        pass    
     