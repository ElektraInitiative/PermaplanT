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
    "name": "My Garden",
    "creation_date": "2023-07-31",
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
                    "x": 1000.0,
                    "y": 0.0
                },
                {
                    "x": 1000.0,
                    "y": 1000.0
                },
                {
                    "x": 0.0,
                    "y": 1000.0
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
INSERT INTO "plantings" ("id", "layer_id", "plant_id", "x", "y", "width", "height", "rotation", "scale_x", "scale_y",
                         "add_date", "remove_date")
VALUES ('00000000-0000-0000-0000-000000000001', 2, 4532, 0400, 0200, 0, 0, 0, 0, 0, null, null),    -- european plum

       ('00000000-0000-0000-0000-000000000002', 2, 1658, 0000, 0000, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000003', 2, 1658, 0010, 0005, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000004', 2, 1658, 0300, 0010, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000005', 2, 1658, 0350, 0000, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000006', 2, 1658, 0400, 0000, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000007', 2, 1658, 0500, 0020, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000008', 2, 1658, 0520, 0015, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000009', 2, 1658, 0550, 0000, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000010', 2, 1658, 0600, 0015, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000011', 2, 1658, 0610, 0000, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000012', 2, 1658, 0620, 0015, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000013', 2, 1658, 0650, 0015, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000014', 2, 1658, 0800, 0015, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000015', 2, 1658, 0820, 0015, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000016', 2, 1658, 0880, 0015, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000017', 2, 1658, 0900, 0015, 0, 0, 0, 0, 0, null, null),    -- sweet fern

       ('00000000-0000-0000-0000-000000000018', 2, 1658, 0080, 0600, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000019', 2, 1658, 0080, 0650, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000020', 2, 1658, 0080, 0700, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000021', 2, 1658, 0080, 0750, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000022', 2, 1658, 0080, 0800, 0, 0, 0, 0, 0, null, null),    -- sweet fern
       ('00000000-0000-0000-0000-000000000023', 2, 1658, 0080, 0850, 0, 0, 0, 0, 0, null, null),    -- sweet fern

       ('00000000-0000-0000-0000-000000000030', 2, 7708, 0550, 1000, 0, 0, 0, 0, 0, null, null),    -- Iris germanica
       ('00000000-0000-0000-0000-000000000031', 2, 7708, 0575, 1000, 0, 0, 0, 0, 0, null, null),    -- Iris germanica
       ('00000000-0000-0000-0000-000000000032', 2, 7708, 0600, 1000, 0, 0, 0, 0, 0, null, null),    -- Iris germanica
       ('00000000-0000-0000-0000-000000000033', 2, 7708, 0625, 1000, 0, 0, 0, 0, 0, null, null),    -- Iris germanica
       ('00000000-0000-0000-0000-000000000034', 2, 7708, 0650, 1000, 0, 0, 0, 0, 0, null, null),    -- Iris germanica
       ('00000000-0000-0000-0000-000000000035', 2, 7708, 0675, 1000, 0, 0, 0, 0, 0, null, null)    -- Iris germanica
;
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
                    "x": 1000.0,
                    "y": 0.0
                },
                {
                    "x": 1000.0,
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

curl --location 'http://localhost:8080/api/maps/1/layers/shade/shadings' \
--header "Authorization: Bearer ${access_token}" \
--header 'Content-Type: application/json' \
--data '{
    "layerId": 3,
    "shade": "permanent shade",
    "geometry": {
        "rings": [
            [
                {
                    "x": 250.0,
                    "y": 50.0
                },
                {
                    "x": 400.0,
                    "y": 12.26
                },
                {
                    "x": 550.0,
                    "y": 50.0
                },
                {
                    "x": 612.26,
                    "y": 200.0
                },
                {
                    "x": 550.0,
                    "y": 350.0
                },
                {
                    "x": 400.0,
                    "y": 412.26
                },
                {
                    "x": 250.0,
                    "y": 350.0
                },
                {
                    "x": 187.74,
                    "y": 200.0
                },
                {
                    "x": 250.0,
                    "y": 50.0
                }
            ]
        ],
        "srid": 4326
    },
    "actionId": "00000000-0000-0000-0000-000000000000"
}'

curl --location 'http://localhost:8080/api/maps/1/layers/shade/shadings' \
--header "Authorization: Bearer ${access_token}" \
--header 'Content-Type: application/json' \
--data '{
    "layerId": 3,
    "shade": "permanent shade",
    "geometry": {
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 400.0
                },
                {
                    "x": 100.0,
                    "y": 400.0
                },
                {
                    "x": 100.0,
                    "y": 1000.0
                },
                {
                    "x": 0.0,
                    "y": 1000.0
                },
                {
                    "x": 0.0,
                    "y": 400.0
                }
            ]
        ],
        "srid": 4326
    },
    "actionId": "00000000-0000-0000-0000-000000000000"
}'

curl --location 'http://localhost:8080/api/maps/1/layers/shade/shadings' \
--header "Authorization: Bearer ${access_token}" \
--header 'Content-Type: application/json' \
--data '{
    "layerId": 3,
    "shade": "light shade",
    "geometry": {
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 900.0
                },
                {
                    "x": 800.0,
                    "y": 900.0
                },
                {
                    "x": 800.0,
                    "y": 1000.0
                },
                {
                    "x": 0.0,
                    "y": 1000.0
                },
                {
                    "x": 0.0,
                    "y": 900.0
                }
            ]
        ],
        "srid": 4326
    },
    "actionId": "00000000-0000-0000-0000-000000000000"
}'
