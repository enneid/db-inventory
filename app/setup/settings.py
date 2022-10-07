from pathlib import Path
from pyaml_env import parse_config 
from box import Box
BASE_DIR = Path(__file__).resolve().parent.parent.parent
config = parse_config(BASE_DIR /'config'/'settings.yml', raise_if_na=True)
server = config.pop('server')
database = config.pop('database')
database["DATABASE_URL"] = database['ENGINE']+\
    "://"+database['USER']+":"+database['PASSWORD']+"@"+\
        database["HOST"]+":"+database["PORT"]+"/"+database["NAME"]  
logger = config.pop('logger')
debug =config["debug"]
auto_console = config["auto_console"]
