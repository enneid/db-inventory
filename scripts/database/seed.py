from pyaml_env import parse_config
import app.setup.base
from app.setup.database import SessionLocal
import app.schemes
import app.models
from app.libs.crypto import create_hash

config = parse_config('config/seed.yml', raise_if_na=True)
inventory = config["inventory"]
with SessionLocal.begin() as db:
    for department in inventory["departments"]:    
        model = app.models.Department(**department)
        db.add(model)
    db.flush()   
    administration_id = db.query(app.models.Department.id).filter(app.models.Department.code == "AD").scalar()
    
    password =  create_hash("admin")
    user = app.models.User(username='admin', encrypted_password=password, department_id=administration_id, role="admin")
    db.add(user)
    db.flush()
    #need to have commit on end
    db.commit()
    db.close()
     