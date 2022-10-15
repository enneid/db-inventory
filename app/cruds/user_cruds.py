from sqlalchemy.orm import Session

from .base_cruds import BaseCruds

from .. import models, schemes
import logging


class UserCruds(BaseCruds):
    __model__ = models.User
    
    __create_scheme__ = schemes.UserCreate
    __change_scheme__ = schemes.UserBase




# def get_users(db: Session):
#     deps =  db.query(models.User).all()
#     return deps

# def create_user(db: Session, scheme: schemes.UserCreate,):
#     encrypted = create_hash(scheme.password) 
#     db_user = models.User(username = scheme.username, role = scheme.role, department = scheme.department_id, encrypted_password=encrypted)
#     db.add(db_user)
#     db.flush()
#     db.refresh(db_user)
#     return db_user

# def find_user(db: Session, user_id: int):
#     return db.query(models.User).filter(models.User.id == user_id).first()

# def change_password(db: Session, user_id: int, scheme: schemes.UserPasswordChange, verify_old=True):
#     user = find_user(user_id)
#     if(verify_old && verify_hash(scheme.old_password) )
#     encrypted = create_hash(scheme.new_password)
    
#     db_user = models.User(username = scheme.username, role = scheme.role, department = scheme.department_id, encrypted_password=encrypted)
#     db.add(db_user)
#     db.flush()
#     db.refresh(db_user)
#     return db_user




