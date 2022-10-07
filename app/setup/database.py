from sqlalchemy import create_engine, pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .settings import database as  _database_settings



SQLALCHEMY_DATABASE_URL = _database_settings["DATABASE_URL"]
engine = create_engine(
    SQLALCHEMY_DATABASE_URL#, connect_args={"check_same_thread": False}
    # , poolclass=pool.NullPool
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_session():
    return SessionLocal()

__all__ = ['Base', 'db_session', 'SessionLocal', 'create_session']        