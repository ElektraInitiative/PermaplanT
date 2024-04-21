#!/usr/bin/env bash

# make sure plprofiler is installed
# sudo pip install git+https://github.com/bigsql/plprofiler/#subdirectory=python-plprofiler

cd benchmarks/backend/heatmap_sql

DATABASE_NAME="permaplant"
DATABASE_USER="permaplant"

# restore original heatmap algorithm (v0)
PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f heatmap_v0_original.sql

# patch heatmap algorithm to v1
if [ "$1" == "--v1" ]; then
    echo "Patching heatmap algorithm (v1: fetch plant relations once)..."
    PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f heatmap_v1_relations_once.sql
fi

# patch heatmap algorithm to v2
if [ "$1" == "--v2" ]; then
    echo "Patching heatmap algorithm (v2: v1 + inlined) ..."
    PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f heatmap_v2_inlined.sql
fi

read -n 1 -p "Do you want to profile a 10, 100 or 1000 shadings map? (s/m/l) " opt;
case $opt in
   s|S)
       printf "\nInserting a 10 shadings map\n"
       PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f setup_data/insert_10_shadings.sql
       ;;
   m|M)
        printf "\nInserting a 100 shadings map\n"
         PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f setup_data/insert_100_shadings.sql
       ;;
   l|L)
      printf "\nInserting a 1000 shadings map\n"
      PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -f setup_data/insert_1000_shadings.sql
      ;;
esac

PGPASSWORD=permaplant plprofiler run --command \
       "select count(*) from calculate_heatmap(1, '{2,3}', 355, '2024-03-03', 100, 0, 0, 10000, 10000);" \
       --name="Heatmap" --title="Heatmap" --desc=""  \
       --output profile.html -h localhost -d $DATABASE_NAME -U $DATABASE_USER


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
