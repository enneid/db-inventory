from .base_cruds import BaseCruds
from .. import models, schemes

class EntryCruds(BaseCruds):
    __model__ = models.Entry
    
    __create_scheme__ = schemes.Entry
    __change_scheme__ = schemes.Entry
