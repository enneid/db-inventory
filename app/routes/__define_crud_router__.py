import typing
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.cruds.base_cruds import BaseCruds
from app.schemes.scheme_base import SchemeBase

from sqlalchemy.orm import Session

from app.setup.database import db_session


def __define_crud_router__(name: str, 
                           __cruds__: type[BaseCruds],
                           __index_params__: BaseModel,
                           __record_scheme__: SchemeBase,
                           __create_scheme__: SchemeBase):
    router = APIRouter(
        prefix="/"+name,
        tags=[name],
        # dependencies=[Depends(get_token_header)],
        responses={404: {"description": "Not found"}})

    def func(id: int = None, db: Session = Depends(db_session), ):
        return __cruds__(db, record_id=id)  

    get_cruds = func      

    @router.get("/", response_model=typing.List[__record_scheme__] )
    def get_items(cruds: __cruds__=Depends(get_cruds), limit: int =100, offset: int=0, params = Depends(__index_params__)):
        return cruds.get_records(limit=limit, offset=offset, **params.dict() )  

    @router.get("/{id}", response_model=__record_scheme__)
    def read_item(cruds: __cruds__=Depends(get_cruds)):
        return cruds.record
 
    @router.post("/")
    def create_item():
        pass

    @router.delete("/{id}")
    def delete_item(cruds: __cruds__=Depends(get_cruds) ):
        cruds.destroy()
        return {"status": "success"}

    @router.put("/{id}")
    def update_item():
        pass

    return router