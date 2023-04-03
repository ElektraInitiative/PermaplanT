# PermaplanT Benchmarks

## Requirements

-   nodejs 19.4.0
-   npm

## Installation and Usage

1. Install dependencies

```shell
npm install
```

2. Start the backend from the backend folder

```shell
cargo run
```

3. Start the frontend from the frontend folder

```shell
npm run dev
```

4. Run benchmarks

```shell
npm run benchmark
```

## Benchmarking

The benchmarking script runs a performance audit on a web page using `Lighthouse` and `Playwright`.
The audit measures the performance of a web page by generating a performance score and then saves the results of the audit in `report` folder:

-   `<test_name>-report.json` - the raw report of LightHouse for a single test case defined in `performance-audit.spec.js`
-   `<timestamp>-lighthouse-results.csv` - the results of the audit for all test cases

Metrics:

-   `First Contentful Paint (FCP)` - the time it takes for the browser to render the first bit of content on the page. Measured in milliseconds.
-   `Interactive` - the time it takes for the page to become fully interactive. Measured in milliseconds.
