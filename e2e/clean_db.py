# Generated with chatgpt.
# A helper script to remove all maps starting with the name "SUT" from the database.
# Currently tests are not capable of cleaning up maps after they are done, so this is
# only a workaround and should eventually be removed.
# Also using a separate database should be considered at some point.

import os
import psycopg2
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

dbname = str(os.getenv("POSTGRES_DB", "permaplant"))
user = str(os.getenv("POSTGRES_USER", "permaplant"))
password = str(os.getenv("POSTGRES_PASSWORD", "permaplant"))
host = urlparse(
    os.environ.get("DATABASE_URL", "postgres://permaplant:permaplant@db/permaplant")
).hostname
port = str(os.getenv("DATABASE_PORT", "5432"))


def delete_maps_with_sut(dbname, user, password, host, port):
    try:
        # Connect to the PostgreSQL server
        conn = psycopg2.connect(
            dbname=dbname, user=user, password=password, host=host, port=port
        )

        # Create a new cursor
        cursor = conn.cursor()

        # Delete rows with "SUT" in the name from the 'maps' table
        delete_query = "DELETE FROM maps WHERE name LIKE '%SUT%';"
        cursor.execute(delete_query)

        # Commit the changes
        conn.commit()

        print("Deleted all rows in 'maps' table with 'SUT' in the name.")
    except (Exception, psycopg2.Error) as error:
        print(f"Error while deleting rows: {error}")
    finally:
        # Close the connection
        if conn is not None:
            conn.close()


delete_maps_with_sut(dbname, user, password, host, port)
