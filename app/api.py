from typing import List
from fastapi import Depends
from sqlalchemy.orm import Session
#from fastapi.middleware.cors import CORSMiddleware


from . import cruds, models, schemes
from app.setup.fastapi import app, db_session
from app.routes import department_router, resource_router, user_router
# from app.authorization import *


# origins = [
#     "http://localhost:3000",
#     "localhost:3000"
# ]


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# ) 




@app.get("/", tags=["root"])
def read_root() -> dict:
    return {"message": "Welcome to your todo list."}




# @app.get("/users/", response_model=List[schemes.User])
# def read_items( db: Session = Depends(db_session)):
#     items = cruds.UserCruds(db).get_records()
#     return items    

app.include_router(user_router)
app.include_router(department_router)
app.include_router(resource_router)