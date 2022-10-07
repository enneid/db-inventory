import psycopg2
from app.libs.console import query_yes_no
from app.setup.settings import database, auto_console

if( not query_yes_no(f"You are going to create database named ${database['NAME']}. Do you want continue?", 
    default='no', auto=auto_console)):
    exit("INTERRUPT")

conn = psycopg2.connect(database="postgres",     
    user=database["USER"], password=database["PASSWORD"], 
    host=database["HOST"], port=database["PORT"]) 

try:
    conn.autocommit = True #  Explains why we do this - we cannot drop or create from within a DB transaction. http://initd.org/psycopg/docs/connection.html#connection.autocommit
    cur = conn.cursor()
    cur.execute( f"CREATE DATABASE {database['NAME']};" )
finally:
    conn.close()