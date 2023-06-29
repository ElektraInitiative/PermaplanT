psql -h db -p 5432 -U permaplant permaplant
psql -h <REMOTE HOST> -p <REMOTE PORT> -U <DB_USER> <DB_NAME>


sudo apt install postgresql-14-postgis-3
sudo apt install postgis-14
CREATE EXTENSION postgis
