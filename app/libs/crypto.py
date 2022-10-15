from passlib.context import CryptContext
__pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_hash(password):
    return __pwd_context.hash(password)

def verify_hash(password, hash):
    return __pwd_context.verify(password, hash)