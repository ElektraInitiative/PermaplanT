# Generated with chatgpt.
# A helper script to remove all maps starting with the name "SUT" from the database.
# Currently tests are not capable of cleaning up maps after they are done, so this is
# only a workaround and should eventually be removed.
# Also using a separate database should be considered at some point.

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(verbose=True)

dbname = str(os.getenv("POSTGRES_DB"))
user = str(os.getenv("POSTGRES_USER"))
password = str(os.getenv("POSTGRES_PASSWORD"))
host = str(os.getenv("POSTGRES_HOST"))
port = str(os.getenv("POSTGRES_PORT"))


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
