#!/usr/bin/env bash

# rm docker container with name postgis
# set compose file env var
COMPOSE_FILE=docker-compose.yml
cd benchmarks/backend/heatmap_sql

printf "Creating database container\n"
docker compose stop
docker compose rm -f

docker volume rm -f heatmap_sql_pgadmin-data-benchmark
docker volume rm -f heatmap_sql_postgis-data-benchmark

# Start the database
# docker run -d --name postgis -e POSTGRES_PASSWORD=permaplant -e POSTGRES_USER=permaplant -p 5432:5432 postgis/postgis:13-3.1
docker compose up --build -d

printf "Waiting for database container to start\n"

sleep 10
cd ../../../backend
LC_ALL=C diesel setup
LC_ALL=C diesel migration run

# Insert data
cd ../scraper && npm run insert

DATABASE_NAME="permaplant"
DATABASE_USER="permaplant"

printf "Inserting map data\n"
PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f ../benchmarks/backend/heatmap_sql/large_map.sql


read -n 1 -p "Inserted all data, start run_queries.sh to start benchmark"

# Collect db logs
# docker logs postgis > postgis.log 2>&1
