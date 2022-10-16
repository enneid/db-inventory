
from datetime import  datetime
import typing

from .scheme_base import SchemeBase,TimestampScheme

  
class DepartmentBase(SchemeBase):
    id: typing.Optional[int]
    name: str
    code: str
    definitions: typing.Optional[dict]

class Department(DepartmentBase, TimestampScheme):
    class Config:
        orm_mode = True
