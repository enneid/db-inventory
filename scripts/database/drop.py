
import psycopg2
from app.setup.settings import database, auto_console
from app.libs.console import query_yes_no

if( not query_yes_no(f"You are going to drop database named ${database['NAME']}. This will be irreversible. Do you want continue?", 
     default='no', auto=auto_console)):
    print("INTERRUPT")
    exit()

conn = psycopg2.connect(database="postgres",     
    user=database["USER"], password=database["PASSWORD"], 
    host=database["HOST"], port=database["PORT"]) 



try:
    conn.autocommit = True #  Explains why we do this - we cannot drop or create from within a DB transaction. http://initd.org/psycopg/docs/connection.html#connection.autocommit
    cur = conn.cursor()
    # print(f"DROP DATABASE {database['NAME']};;") 
    cur.execute( f"DROP DATABASE {database['NAME']};" )
finally:
    conn.close()