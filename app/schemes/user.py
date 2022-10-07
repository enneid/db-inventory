import typing
from pydantic import BaseModel
from datetime import  datetime

from .scheme_base import SchemeBase,TimestampScheme


class UserBase(SchemeBase):
    id: typing.Optional[int]
    username: str
    jsondata: dict
    department_id: int
   
class UserCreate(SchemeBase):
    encrypted_password: str

class User(UserBase, TimestampScheme):
    department_code: typing.Optional[str]  
    class Config:
        orm_mode = True