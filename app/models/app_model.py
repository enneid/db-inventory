from sqlalchemy import Column, DateTime, Integer
import datetime
from ..setup.database import Base

class AppModel(Base):
    __abstract__ = True

    def __init__(self, *args, **kwargs):
        kwargs, hash =self.__init_extract___compute_fields____(**kwargs)
        Base.__init__(self, *args, **kwargs)
        self.__init___compute_fields____(hash)

    def __init_extract___compute_fields____(self, **kwargs):
        hash = dict() 
        for field in self.__compute_fields__:
            if field in kwargs:
                hash[field] = kwargs.pop(field)
        return kwargs, hash

    def __init___compute_fields____(self, hash):
        for key, value in hash.items():
           setattr(self, key, value)

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
        
    __compute_fields__ = []

    # class Meta:
    #     abstract = True