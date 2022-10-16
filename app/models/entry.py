from sqlalchemy import JSON, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, validates
from app.models.department import Department
from app.models.resource import Resource
from app.models.user import User
from app import descriptors
from .app_model import AppModel

class Entry(AppModel):
    __tablename__ = "entries"
    __compute_fields__ = ['message', 'params']

    resource_id = Column(Integer, ForeignKey("resources.id"))
    resource: Resource = relationship('Resource')
    resource_code = Column(String, nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department: Department = relationship("Department")
    department_code = Column(String, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user: User = relationship("User")
    username =  Column(String, nullable=False, index=True)
    operation =  Column(String, nullable=False, index=True)
    amount = Column(Integer, index=True, default=0 )
    jsondata = Column(JSON, default=dict)

    message: str = descriptors.DictDeepField(dictfield="jsondata")
    params: str = descriptors.DictDeepField(dictfield="jsondata")

    @validates('resource_code', 'department_code', 'username', 'operation')
    def convert_upper(self, key, value):
        return value.upper()

    class Meta:
        pass    
     