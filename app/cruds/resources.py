
from sqlalchemy.orm import Session
from app import schemes
from app import models
from .base_cruds import BaseCruds

class ResourceCruds(BaseCruds):
    __model__ = models.Resource
    
    __create_scheme__ = schemes.ResourceBase
    __change_scheme__ = schemes.Resource