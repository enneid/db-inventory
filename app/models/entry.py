from sqlalchemy import JSON, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, validates
from app.models.department import Department
from app.models.resource import Resource
from app.models.user import User
from app import descriptors
from .app_model import AppModel

class Entry(AppModel):
    __tablename__ = "entries"

    resource_id = Column(Integer, ForeignKey("resources.id"))
    resource: Resource = relationship('Resource')
    resource_code = Column(String, max_length=50, db_index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department: Department = relationship("Department")
    department_code = Column(String, max_length=50, db_index=True)
    users_id = Column(Integer, ForeignKey("users.id"))
    user: User = relationship("User")
    username =  Column(String, max_length=50, db_index=True)
    operation =  Column(String, max_length=50, db_index=True)
    amount = Column(Integer)
    jsondata = Column(JSON, default=dict)

    message: str = descriptors.DictDeepField(dictfield="jsondata")
    params: str = descriptors.DictDeepField(dictfield="jsondata")

    @validates('resource_code', 'department_code', 'username', 'operation')
    def convert_upper(self, key, value):
        return value.upper()

    class Meta:
        pass    
     