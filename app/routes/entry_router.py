import typing
from pydantic import BaseModel
from app.cruds.entry_cruds import EntryCruds
from app.schemes.entry import EntryBase, Entry
from .__define_crud_router__ import __define_crud_router__

class IndexParams(BaseModel):
    department: typing.Optional[str]

entry_router = __define_crud_router__("entries", EntryCruds, IndexParams, Entry, EntryBase)