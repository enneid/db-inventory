import typing
from .scheme_base import SchemeBase, TimestampScheme


class ResourceBase(SchemeBase):
    id: typing.Optional[int]
    code: str
    params: str
    amount: int
    department_id: int

class Resource(ResourceBase, TimestampScheme):
    department_code: typing.Optional[str]

    class Config:
        orm_mode = True