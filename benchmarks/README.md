# PermaplanT Benchmarks

## Requirements

-   nodejs 19.4.0
-   npm

## Installation and Usage

1. Install dependencies

```shell
npm install
```

2. Run benchmarks

```shell
npm run benchmark
```

The script runs a performance audit on a web page using `Lighthouse` and `Playwright`.
The audit measures the performance of a web page by generating a performance score, and then saves the results of the audit in a JSON file with a filename in the format `<timestamp>-report.json`, where `timestamp` is the current date and time.
