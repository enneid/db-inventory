import typing
from fastapi import Depends
from pydantic import BaseModel
from app.models.resource import ResourceOperation
from app.schemes.resource import Resource, ResourceBase
from app.cruds import ResourceCruds
from .__define_crud_router__ import __define_crud_router__, create_cruds_dependency

class IndexParams(BaseModel):
    department: typing.Optional[str]

class ResourceOperationParms(BaseModel):
    amount: int
    message: typing.Optional[str]

cruds_dependency = create_cruds_dependency(ResourceCruds)
resource_router = __define_crud_router__("resources", ResourceCruds, IndexParams, Resource, ResourceBase, exclude=["create" "update", "delete"], cruds_dependecy=cruds_dependency)


@resource_router.put("/${id}/push", response_model=Resource)
def create_item(cruds: ResourceCruds=Depends(cruds_dependency), params: ResourceOperationParms= Depends(ResourceOperationParms)): 
    return cruds.make_operation(ResourceOperation.PUSH, params.amount, message=params.message)

    

@resource_router.put("/${id}/pop", response_model=Resource)
def create_item(cruds: ResourceCruds=Depends(cruds_dependency), params: ResourceOperationParms= Depends(ResourceOperationParms)): 
    return cruds.make_operation(ResourceOperation.POP, params.amount, message=params.message)

@resource_router.put("/${id}/set", response_model=Resource)
def create_item(cruds: ResourceCruds=Depends(cruds_dependency), params: ResourceOperationParms= Depends(ResourceOperationParms)): 
    return cruds.make_operation(ResourceOperation.SET, params.amount, message=params.message)