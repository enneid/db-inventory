# from asyncio.windows_events import NULL
# from dataclasses import fields
from typing import Dict
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func

from app import descriptors
from .app_model import AppModel

class Department(AppModel):
   
    # compute_fields = ["definitions"]
    __tablename__ = "departments"
    __compute_fields__ = ['definitions']
    
    name = Column(String, nullable=False, index=True, unique=True)
    code = Column(String, nullable=False, index=True, unique=True)

    jsondata = Column(JSON, default=dict)

    @validates('code', 'name')
    def convert_upper(self, key, value):
        return value.upper()

    # code = descriptors.UpperCaseCharField(max_length=30, db_index=True, unique=True, null=False)
    # name = descriptors.UpperCaseCharField(max_length=30, db_index=True, unique=True, null=False)
    # created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    # updated_at = models.DateTimeField(auto_now=True, db_index=True)
    # metadata = models.JSONField(default=dict)
    definitions: Dict = descriptors.DictDeepField(dictfield="jsondata")

    class Meta:
        pass
