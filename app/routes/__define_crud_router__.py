import typing
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.cruds.base_cruds import BaseCruds
from app.models.user import User
from app.schemes.scheme_base import SchemeBase

from sqlalchemy.orm import Session

from app.setup.database import db_session


def current_user( db: Session = Depends(db_session)):
    return db.query(User).filter(User.username == "ADMIN").first()


def create_cruds_dependency(__cruds__: type[BaseCruds]):
    def func(id: int = None, db: Session = Depends(db_session), current_user: User = Depends(current_user) ): 
        return __cruds__(db, record_id=id, current_user=current_user)
    return func 

def __define_crud_router__(name: str, 
                           __cruds__: type[BaseCruds],
                           __index_params__: BaseModel,
                           __record_scheme__: SchemeBase,
                           __create_scheme__: SchemeBase,
                           cruds_dependecy = None,
                           exclude: typing.List[str]=[]
                           ):
    cruds_dependecy = cruds_dependecy or create_cruds_dependency(__cruds__)    
    router = APIRouter(
        prefix="/"+name,
        tags=[name],
        # dependencies=[Depends(get_token_header)],
        responses={404: {"description": "Not found"}})

  

    if("index" not in exclude):
        @router.get("/", response_model=typing.List[__record_scheme__] )
        def get_items(cruds: __cruds__=Depends(cruds_dependecy), limit: int =100, offset: int=0, params = Depends(__index_params__)):
            return cruds.get_records(limit=limit, offset=offset, **params.dict() )

    if("count" not in exclude):
        @router.get("/count")
        def get_items(cruds: __cruds__=Depends(cruds_dependecy), limit: int =100, offset: int=0, params = Depends(__index_params__)):
                return cruds.count_records(limit=limit, offset=offset, **params.dict() )           

    if("create" not in exclude):
        @router.post("/")
        def create_item(cruds: __cruds__=Depends(cruds_dependecy), params = Depends(__create_scheme__)):
                return cruds.create(params )  


    if("get" not in exclude):
        @router.get("/{id}", response_model=__record_scheme__)
        def read_item(cruds: __cruds__=Depends(cruds_dependecy)):
            return cruds.record
 


    if("delete" not in exclude):
        @router.delete("/{id}")
        def delete_item(cruds: __cruds__=Depends(cruds_dependecy) ):
            cruds.destroy()
            return {"status": "success"}

    if("update" not in exclude):
        @router.put("/{id}")
        def update_item():
            pass

    return router