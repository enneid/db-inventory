import typing
from .scheme_base import SchemeBase, TimestampScheme


class EntryBase(SchemeBase):
    id: typing.Optional[int]
    resource_code: str
    resource_id: typing.Optional[int]
    department_code: str
    department_id: typing.Optional[int]
    username: str
    user_id: typing.Optional[int]
    operation: str
    message: str
    amount: int

class Entry(EntryBase, TimestampScheme):
    class Config:
        orm_mode = True

