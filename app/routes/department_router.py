import typing
from pydantic import BaseModel
from app.cruds.departments_cruds import DepartmentsCruds
from app.schemes.department import Department, DepartmentBase
from .__define_crud_router__ import __define_crud_router__

class IndexParams(BaseModel):
    code: typing.Optional[str]

department_router = __define_crud_router__("departments", DepartmentsCruds, IndexParams, Department, DepartmentBase)