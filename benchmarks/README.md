# PermaplanT Benchmarks

## Requirements

-   nodejs 19.4.0
-   npm

## Installation and Usage

1. Install dependencies

```shell
npm install
```

2. Populate the database with example maps

In order to benchmark the performance of the canvas, we need to populate the database with example maps.
There are maps of different sizes and complexity, which are stored in a single CSV file called `map.csv` in the `/benchmarks` folder.
The maps are stored in a CSV file because they are huge and it is easier to store them in a CSV file than in a database migrations,
To populate the database with the maps, run the following command:

```shell
npm run start
```

Note: This will clean the `maps` table and insert the maps from the CSV file.

3. Start the backend from the backend folder

```shell
cargo run
```

4. Start the frontend from the frontend folder

```shell
npm run dev
```

5. Run benchmarks

```shell
npm run benchmark
```

## Implementation

### Backend

-   `maps` table is simple and contains only the map name and the canvas as a JSON string.

-   Simple backend implementation for map creation and retrieval.

### Frontend

-   The frontend implementation i.e. react state management is also simple and doesn't contain any complex logic except the canvas itself.

-   Available canvas functionality:
    -   save map
    -   hide layers
    -   generate circles on a new layer
    -   generate rectangles on a new layer
    -   undo/redo
    -   zoom in/out
    -   reset zoom
    -   drag and drop

### Benchmarking

The benchmarking script runs a performance audit on a web page using `Lighthouse` and `Playwright`.
The audit measures the performance of a web page by generating a performance score and then saves the results of the audit in `report` folder:

-   `<test_name>-report.json` - the raw report of LightHouse for a single test case (e.g. `100 circles` on the canvass)
-   `<timestamp>-lighthouse-results.csv` - the results of the audit for all test cases (e.g. `100 circles`, `1000 circles`, `10000 circles` etc.)
-   `<timestamp>-lighthouse-results-shapes.csv` - the results of the audit for all test cases related to shapes (e.g. `100 circles` vs. `100 stars`).

Metrics:

-   `First Contentful Paint (FCP)` - the time it takes for the browser to render the first bit of content on the page. Measured in milliseconds.
-   `Interactive` - the time it takes for the page to become fully interactive. Measured in milliseconds.
-   `Score` - the performance score of the page. Measured in percentage. The metric is calculated based on the weighted average of the other metrics. (PENDING, will probably be removed because it depends on the other metrics, which are not considered in the study)

#### Test cases

The benchmarking script runs the audit for the following test cases:

1. empty canvas
2. 3 elements on the canvas
3. 3 circles on the canvas
4. 100 circles on the canvas
5. 1000 circles on the canvas
6. 10000 circles on the same layer on the canvas
7. 10000 circles on 10 different layers on the canvas

Additionally, the benchmarking script runs the audit for the following test cases related to shapes:

1. 100 circles on the canvas
2. 100 complex stars on the canvas
