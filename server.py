import uvicorn
from app.setup.settings import server, debug
if __name__ == "__main__":
    uvicorn.run("app.api:app", host=server["host"], port=int(server["port"]), reload=debug)
