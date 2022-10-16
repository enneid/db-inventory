from sqlalchemy.orm import Session
from app import schemes, models
from .base_cruds import BaseCruds

class DepartmentsCruds(BaseCruds):
    __model__ = models.Department
    
    __create_scheme__ = schemes.DepartmentBase
    __change_scheme__ = schemes.DepartmentBase