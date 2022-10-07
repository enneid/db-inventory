from sqlalchemy.orm import Session
from .. import models
import logging

def get_departments(db: Session):
    deps =  db.query(models.Department).all()
    return deps