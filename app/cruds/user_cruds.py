from sqlalchemy.orm import Session

from .base_cruds import BaseCruds

from .. import models, schemes



class UserCruds(BaseCruds):
    __model__ = models.User
    
    __create_scheme__ = schemes.UserCreate
    __change_scheme__ = schemes.UserBase





