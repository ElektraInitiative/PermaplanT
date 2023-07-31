#!/usr/bin/env bash

# Start the database and run migrations
cd backend
docker run -d --name postgis -e POSTGRES_PASSWORD=permaplant -e POSTGRES_USER=permaplant -p 5432:5432 postgis/postgis:13-3.1 -c log_min_duration_statement=0 -c log_statement=all
sleep 10
LC_ALL=C diesel setup
LC_ALL=C diesel migration run

# Insert data
cd ../scraper && npm run insert
printf "\nNow run the backend in a second shell.\n"
read -n 1 -p "Press any key to continue!"
../benchmarks/backend/relations/insert_data.sh $1 $2
printf "\n\nStop the backend.\n"
read -n 1 -p "Press any key to continue!"

# Start the backend
cd ../backend
RUST_LOG="backend=warn,actix_web=warn" PERF=/usr/lib/linux-tools/5.4.0-153-generic/perf cargo flamegraph --open

# Collect db logs
docker logs postgis > postgis.log 2>&1

# Remove database
docker kill postgis
docker rm postgis
