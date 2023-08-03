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
read -n 1 -p "Do you want to benchmark a small, medium or large map? (s/m/l) " opt;
case $opt in
    s|S)
        echo "small map"
        ../benchmarks/backend/heatmap/insert_data-small_map.sh $1 $2
        ;;
    m|M)
        echo "middle map"
        ../benchmarks/backend/heatmap/insert_data-middle_map.sh $1 $2
        ;;
    l|L)
        echo "large map"
        ../benchmarks/backend/heatmap/insert_data-large_map.sh $1 $2
        ;;
esac
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
