# Test Protocol Heatmap

Information:

- Tester: Gabriel
- Date/Time: 11.7.2023 17:30
- Duration: 10min
- Commit/Tag: [6a77ade](https://github.com/ElektraInitiative/PermaplanT/tree/6a77ade30b943ca364a35843e01b6dd2c61c8b20)
- Planned tests: 1
- Executed tests: **1**
- Passed tests: 1
- Failed tests: 0

| Test Case | Description                                                       | Preconditions | Test Steps       | Expected Result                                    | Actual Result | Test Result | Notes |
| --------- | ----------------------------------------------------------------- | ------------- | ---------------- | -------------------------------------------------- | ------------- | ----------- | ----- |
| TC-001    | Test whether the heatmap endpoints generates the image correctly. | None          | Described below. | Heatmap considers map polygon and plant relations. | It worked.    | ✔️          |       |
|           |                                                                   |               |                  |                                                    |               |             |       |

### Test Steps

1. Create the database and run migrations.
2. Insert the plants using the scraper (`cd scraper && npm run insert`)
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

5. Insert some dummy relations and plantings (via JetBrains' DataGrip)

```SQL
INSERT INTO relations
VALUES (1, 2, 'companion'),
       (1, 3, 'neutral'),
       (1, 4, 'antagonist');

INSERT INTO plantings
VALUES ('00000000-0000-0000-0000-000000000000', 2, 1, 10, 10, 0, 0, 0, 0, 0),
       ('00000000-0000-0000-0000-000000000001', 2, 2, 11, 10, 0, 0, 0, 0, 0),
       ('00000000-0000-0000-0000-000000000002', 2, 2, 23, 10, 0, 0, 0, 0, 0),
       ('00000000-0000-0000-0000-000000000003', 2, 2, 40, 10, 0, 0, 0, 0, 0),
       ('00000000-0000-0000-0000-000000000004', 2, 2, 10, 20, 0, 0, 0, 0, 0),
       ('00000000-0000-0000-0000-000000000005', 2, 3, 10, 20, 0, 0, 0, 0, 0);
```

6. Execute the request (via Postman, equivalent cURL below - cURL won't display the image).

```bash
curl --location 'http://localhost:8080/api/maps/1/layers/plants/heatmap?plant_id=1&layer_id=2' \
--header 'Authorization: Bearer <token>'
```

## Closing remarks

- In the tested commit, layers other than the plant layer are not considered.
