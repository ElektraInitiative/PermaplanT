#!/usr/bin/env bash

cd benchmarks/backend/heatmap_sql

DATABASE_NAME="permaplant"
DATABASE_USER="permaplant"

read -n 1 -p "Do you want to benchmark a 10, 100 or 10000 shadings map? (s/m/l) " opt;
case $opt in
   s|S)
       printf "\nInserting a 10 shadings map\n"
       PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f insert_10_shadings.sql
       ;;
   m|M)
       printf "\nInserting a 100 shadings map\n"
        PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f insert_100_shadings.sql
       ;;
   l|L)
       printf "\nInserting a 1000 shadings map\n"
       PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f insert_1000_shadings.sql
       ;;
esac


DATABASE_NAME="permaplant"
DATABASE_USER="permaplant"

PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -c "\timing" -c "
select count(1) from calculate_heatmap(1, '{2,3}', 2921, '2024-03-03', 100, 0, 0, 10000, 10000);
"
PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -c "\timing" -c "
select count(1) from calculate_heatmap(1, '{2,3}', 2921, '2024-03-03', 100, 0, 0, 10000, 10000);
"
PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -c "\timing" -c "
select count(1) from calculate_heatmap(1, '{2,3}', 2921, '2024-03-03', 100, 0, 0, 10000, 10000);
"
PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -c "\timing" -c "
select count(1) from calculate_heatmap(1, '{2,3}', 2921, '2024-03-03', 100, 0, 0, 10000, 10000);
"
PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -c "\timing" -c "
select count(1) from calculate_heatmap(1, '{2,3}', 2921, '2024-03-03', 100, 0, 0, 10000, 10000);
"
# 23 2024-03-03 21:57:23.344 UTC [1277] DETAIL:  parameters: $1 = '1', $2 = '{2,3}', $3 = '2921', $4 = '2024-03-03', $5 = '100', $6 = '0', $7 = '0', $8 = '10000', $9 = '10000'
# 2024-03-03 22:57:23 2024-03-03 21:57:23.344 UTC [1277] LOG:  execute s50: SELECT * FROM calculate_heatmap($1, $2, $3, $4, $5, $6, $7, $8, $9)
#
#     p_map_id INTEGER,
#     p_layer_ids INTEGER [],
#     p_plant_id INTEGER,
#     date DATE,
#     granularity INTEGER,
#     x_min INTEGER,
#     y_min INTEGER,
#     x_max INTEGER,
#     y_max INTEGER
