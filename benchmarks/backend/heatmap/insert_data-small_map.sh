#!/usr/bin/env bash

username=$1
password=$2

# Get the OAuth2 access token
access_token=$(curl --request POST \
    --url 'https://auth.permaplant.net/realms/PermaplanT/protocol/openid-connect/token' \
    --header 'content-type: application/x-www-form-urlencoded' \
    --data grant_type=password \
    --data "username=${username}" \
    --data "password=${password}" \
    --data 'client_id=localhost' | jq -r .access_token)

# Create map
curl --location 'http://localhost:8080/api/maps' \
--header "Authorization: Bearer ${access_token}" \
--header 'Content-Type: application/json' \
--data '{
    "name": "Test Map",
    "creation_date": "2023-07-25",
    "is_inactive": false,
    "zoom_factor": 100,
    "honors": 0,
    "visits": 0,
    "harvested": 0,
    "privacy": "public",
    "description": "",
    "geometry": {
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 0.0
                },
                {
                    "x": 100.0,
                    "y": 0.0
                },
                {
                    "x": 100.0,
                    "y": 100.0
                },
                {
                    "x": 0.0,
                    "y": 100.0
                },
                {
                    "x": 0.0,
                    "y": 0.0
                }
            ]
        ],
        "srid": 4326
    }
}'

# Create plantings
DATABASE_NAME="permaplant"
DATABASE_USER="permaplant"
PGPASSWORD=permaplant psql -h localhost -p 5432 -U $DATABASE_USER -d $DATABASE_NAME -c "
INSERT INTO plantings (id, layer_id, plant_id, x, y, width, height, rotation, scale_x, scale_y, add_date, remove_date)
VALUES
    ('00000000-0000-0000-0000-000000000000', 2, 1, 15, 15, 0, 0, 0, 0, 0, DEFAULT, DEFAULT),
    ('00000000-0000-0000-0000-000000000001', 2, 2, 20, 30, 0, 0, 0, 0, 0, DEFAULT, DEFAULT);
"

# Create shadings
curl --location 'http://localhost:8080/api/maps/1/layers/shade/shadings' \
--header "Authorization: Bearer ${access_token}" \
--header 'Content-Type: application/json' \
--data '{
    "layerId": 3,
    "shade": "partial shade",
    "geometry": {
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 0.0
                },
                {
                    "x": 200.0,
                    "y": 0.0
                },
                {
                    "x": 200.0,
                    "y": 200.0
                },
                {
                    "x": 0.0,
                    "y": 200.0
                },
                {
                    "x": 0.0,
                    "y": 0.0
                }
            ]
        ],
        "srid": 4326
    },
    "actionId": "00000000-0000-0000-0000-000000000000"
}'
