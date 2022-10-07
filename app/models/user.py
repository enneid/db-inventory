from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
import datetime
from app.models.department import Department
from .app_model import AppModel

class User(AppModel):
    __tablename__ = "users"

    username = Column(String, nullable=False, index=True, unique=True)
    encrypted_password = Column(String, nullable=False)
    jsondata = Column(JSON, default=dict)

    active = Column(Boolean, index=True, default=True )
    role = Column(String, nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department: Department = relationship("Department")
    
    @property
    def department_code(self):
        if((self.department_id is None) or (self.department is None)): return None
        self.department.code

    @validates('username', 'role')
    def convert_upper(self, key, value):
        return value.upper()    

    # class Meta:
    #     abstract = True