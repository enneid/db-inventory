import typing
from pydantic import BaseModel
from app.schemes.user import User, UserCreate
from app.cruds.user_cruds import UserCruds
from .__define_crud_router__ import __define_crud_router__

class IndexParams(BaseModel):
    role: typing.Optional[str]
    department: typing.Optional[str]
    department_id: typing.Optional[str]
    username: typing.Optional[str]


user_router = __define_crud_router__("users", UserCruds, IndexParams, User, UserCreate)

@user_router.put("/{id}/change_password")
def update_item():
    pass