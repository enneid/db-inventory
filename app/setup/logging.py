import logging
from .settings import logger

_format = "%(asctime)s - %(levelname)s - %(message)s"
class CustomFormatter(logging.Formatter):

    grey = "\x1b[38;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    format = _format

    FORMATS = {
        logging.DEBUG: grey + format + reset,
        logging.INFO: grey + format + reset,
        logging.WARNING: yellow + format + reset,
        logging.ERROR: red + format + reset,
        logging.CRITICAL: bold_red + format + reset
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)

formatter = CustomFormatter()


filehandler = logging.FileHandler(logger["filename"])
filehandler.setLevel(getattr(logger, 'filelevel', logger['level']))

consolehandler = logging.StreamHandler()
consolehandler.setLevel(logger['level'])
consolehandler.setFormatter(formatter)
# consolehandler.setFormatter(log_format)
logging.basicConfig( 
    # filename=logger["filename"], 
    datefmt='%Y-%m-%d %H:%M:%S',  
    level=logger["level"], 
    format=_format,
    handlers=[filehandler, consolehandler]
    )
logging.getLogger('sqlalchemy.engine').setLevel(logger["level"])
logging.getLogger("sqlalchemy.pool").setLevel(logging.DEBUG)
