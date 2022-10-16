from abc import abstractmethod
import typing

from sqlalchemy.orm import Session, Query
from app.libs.dict_helper import popattr

from app.models.app_model import AppModel
from app.models.user import User
from app.schemes.scheme_base import SchemeBase

class BaseCruds():
    
    db: Session
    __model__ = AppModel
    __create_scheme__ = SchemeBase
    __change_scheme__ = SchemeBase
    
    current_user: User
    commit_changes = True
    
    _record: __model__
    _record_id: int = None

    def __init__(self, db: Session, current_user: User = None, record_id: int=None, record: __model__=None):
        self.db = db
        self._record_id = record_id
        self._record = record
        self.current_user = current_user

    @property
    def record_id(self):
        if(self._record_id is None): raise Exception("record_id not set")
        return self._record_id

    @record_id.setter
    def record_id(self, id):
        self._record_id = id
        if (self._record is not None) and self._record.id != id: self._record = None

    @property
    def record(self):
        self._record = self._record or  self.find_record()
        return self._record

    @record.setter
    def record(self, rec):
        self._record = rec
        if rec is not None: self._record_id = rec.id             
        
    def get_records(self, **params):
        return self.prepare_query(**params).all() 

    def find_record(self, record_id: int = None):
        record_id = record_id or self.record_id
        if(record_id is None): raise Exception("record_id not set")
        return self.query().filter(self.__model__.id == record_id).first()

    def reload_record(self):
        if(self._record): self.db.refresh(self._record)
        return self.record

    def filter_query(self, query: Query, **params):
        return query

    def order_query(self, query: Query, **params):   
        return query.order_by(self.__model__.updated_at)   

    def limit_query(self, query: Query, skip: int = 0, limit: int = 100, **params  ):
        query = query.offset(skip)
        if(limit != -1): query = query.limit(limit)
        return query

    def preload_query(self, query: Query, preolaod = [], **params  ):
        return query

    def count_records(self, **params):
        popattr(params, "skip")
        popattr(params, "limit")
        return self.prepare_query(**params, skip=0, limit=-1).count()

    def prepare_query(self, query: Query = None,  preload = [], skip: int = 0, limit: int = 100, **params):
        if(query is None): query = self.query()
        query = self.filter_query(query, **params)
        query = self.order_query(query, **params)
        if(len(preload) >0 ): query = self.preload(query, preload)
        return query

    def query(self):
        return self.db.query(self.__model__)

    def push_changes(self, commit: bool=None):
        if commit is None: commit = self.commit_changes
        if commit == True:
            self.db.commit()
        else:
            self.db.flush()      

    def prepare_create(self, params: __create_scheme__):
        model = self.__model__() 
        return self.generic_prepare_update(model, params)
    
    def create(self, params: __create_scheme__, commit=True):
        model = self.prepare_create(params)
        self.db.add(model)
        self.push_changes(commit)
        self.db.refresh(model)
        return model  

    def destroy(self,  commit=None):
       self.db.delete(self.record)
       self.push_changes(commit)


    def generic_prepare_update(self, params: dict, resource: __model__ = None):
        resource = resource or self.resource
        for var, value in vars(params).items():
            if value: setattr(resource, var, value)
        return resource     

    def prepare_update(self, params: __change_scheme__, resource: __model__= None):
        self.generic_prepare_update(params.dict, resource = resource)

    def update(self, params: __change_scheme__, commit=None):
        self.prepare_update(self.record, params)
        self.push_changes(commit)
        self.db.refresh(self.record)
        return self.record    