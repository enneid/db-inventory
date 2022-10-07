from sqlalchemy.orm import Session

from .. import models
import logging

def get_users(db: Session):
    deps =  db.query(models.User).all()
    return deps