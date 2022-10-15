import typing
from pydantic import BaseModel
from datetime import  datetime

from .scheme_base import SchemeBase,TimestampScheme


class UserBase(SchemeBase):
    id: typing.Optional[int]
    username: str
    role: str
    jsondata: dict
    department_id: int
   
class UserCreate(UserBase):
    password: str


class UserPasswordChange(SchemeBase):
    id: typing.Optional[int]
    new_password: str
    old_password: typing.Optional[str]

class User(UserBase, TimestampScheme):
    department_code: typing.Optional[str]  
    class Config:
        orm_mode = True