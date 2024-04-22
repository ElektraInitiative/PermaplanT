# Heatmap with Shade

## General

- Tester: Gabriel
- Date/Time: 31.07.2023 21:50
- Duration: 15 min
- Commit/Tag: a8b0079cbdd638aea5600373434d8dddcca8e7e7
- Planned tests: 1
- Executed tests: **1**
- Passed tests: 1
- Failed tests: 0

## Error Analysis

## Closing remarks

This test was executed to show how the heatmap can be generated without the frontend being fully implemented.

## Testcases

### TC-007 - Heatmap

1. Get a clean database with all migrations: `cd backend && diesel database reset`.
2. Insert the plants and relations using the scraper (`cd scraper && npm run insert`)
3. Start the backend (`cd backend && cargo run`).
4. Create a map (via Postman, equivalent cURL below - remember to insert the token).

```bash
curl --location 'http://localhost:8080/api/maps' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Test1",
    "creation_date": "2023-07-06",
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
                    "x": 50.0,
                    "y": 100.0
                },
                {
                    "x": 50.0,
                    "y": 50.0
                },
                {
                    "x": 0.0,
                    "y": 50.0
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
```

The result should be:

```json
{
  "id": 1,
  "name": "Test1",
  "creation_date": "2023-07-06",
  "deletion_date": null,
  "last_visit": null,
  "is_inactive": false,
  "zoom_factor": 100,
  "honors": 0,
  "visits": 0,
  "harvested": 0,
  "privacy": "public",
  "description": "",
  "location": null,
  "owner_id": "361c7c28-020f-4b31-84ea-cc629cc43180",
  "geometry": {
    "rings": [
      [
        {
          "x": 0.0,
          "y": 0.0,
          "srid": 4326
        },
        {
          "x": 100.0,
          "y": 0.0,
          "srid": 4326
        },
        {
          "x": 100.0,
          "y": 100.0,
          "srid": 4326
        },
        {
          "x": 50.0,
          "y": 100.0,
          "srid": 4326
        },
        {
          "x": 50.0,
          "y": 50.0,
          "srid": 4326
        },
        {
          "x": 0.0,
          "y": 50.0,
          "srid": 4326
        },
        {
          "x": 0.0,
          "y": 0.0,
          "srid": 4326
        }
      ]
    ],
    "srid": 4326
  }
}
```

5. Create a shading.

```bash
curl --location 'http://localhost:8080/api/maps/1/layers/shade/shadings' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
    "layerId": 3,
    "shade": "light shade",
    "geometry": {
        "rings": [
            [
                {
                    "x": 0.0,
                    "y": 0.0
                },
                {
                    "x": 20.0,
                    "y": 0.0
                },
                {
                    "x": 20.0,
                    "y": 20.0
                },
                {
                    "x": 0.0,
                    "y": 20.0
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
```

The result should be:

```json
{
  "id": "21c9ca45-5ff4-492a-a537-7eb64c134613",
  "layerId": 3,
  "shade": "light shade",
  "geometry": {
    "rings": [
      [
        {
          "x": 0.0,
          "y": 0.0,
          "srid": 4326
        },
        {
          "x": 20.0,
          "y": 0.0,
          "srid": 4326
        },
        {
          "x": 20.0,
          "y": 20.0,
          "srid": 4326
        },
        {
          "x": 0.0,
          "y": 20.0,
          "srid": 4326
        },
        {
          "x": 0.0,
          "y": 0.0,
          "srid": 4326
        }
      ]
    ],
    "srid": 4326
  },
  "addDate": null,
  "removeDate": null
}
```

6. Execute the request.

```bash
curl -o file.png --location 'http://localhost:8080/api/maps/1/layers/plants/heatmap?plant_id=1&plant_layer_id=2&shade_layer_id=3' \
--header 'Authorization: Bearer <token>'
```

7. Verify:

- The bottom left corner should be transparent, everything else should be green.
- The top left corner should be green (as there is shade there and plant with id 1 likes shade); the rest should be yellow.
