# Performance Benchmarks

## Requirements

The following tools are required to run the benchmarks:

- docker
- [nushell](https://github.com/nushell/nushell)
- perf
- [flamegraph](https://github.com/flamegraph-rs/flamegraph)
- [httperf](https://github.com/httperf/httperf)
- standard linux tools like `grep`, `awk` or `psql`

## Setup

Add the following to the end of `Cargo.toml`.
This is necessary to ensure that perf can accurately track the function stack.

```toml
[profile.release]
debug = true
```

## Scripts

You can find the scripts in `benchmark/backend/`.
They are supposed to be run from the repositories root folder.

The subfolders contain scripts to run performance benchmarks in specific endpoints.

### `setup.sh`

Execute like the following:  
`./benchmarks/backend/<endpoint>/setup.sh <username> <password>`.

It will start the database and backend.
Depending on the endpoint it might execute `insert_data.sh` scripts to insert additional data into the database.

The script might output instructions while executing.
Follow these instructions to ensure the benchmark works correctly.

Parameters:

- username: Your PermaplanT username.
- password: Your PermaplanT password.

### `run_httperf.sh`

Execute like the following:  
`./benchmarks/backend/<endpoint>/run_httperf.sh <username> <password> <number_of_requests> <request_rate>`.

This script shall be run as soon as the `setup.sh` starts the backend via `cargo flamegraph`.  
It will execute requests on the backend using httperf.

Once this script finishes you can interrupt `setup.sh` via Ctrl+C.
Note that it might take 20min or longer to finish once interrupted.
Do not press Ctrl+C again, otherwise the generated flamegraph will not include all data.

Parameters:

- username: Your PermaplanT username.
- password: Your PermaplanT password.
- number_of_requests: The total number of requests httperf will execute.
- request_rate: How many requests will be executed per second.

### `get_statistics.sh`

Execute like the following:  
`./benchmarks/backend/<endpoint>/get_statistics.sh`.

This script shall be executed once all previous scripts finished.  
It will parse the PostgreSQL logs and httperf logs to extract execution times.

## Example run

The following is a step by step guide on how to execute the benchmark for the heatmap:

1. Insert
   ```toml
    [profile.release]
    debug = true
   ```
   into `Cargo.toml`.
2. Execute: `./benchmarks/backend/heatmap/setup.sh <username> <password>`. Do the following once the script gives the instructions.
   - Start the backend in dev mode.
   - Press Enter.
   - Stop the backend.
   - Press Enter.
3. Wait for the backend to start in release mode.
4. Once its started execute in a second shell: `./benchmarks/backend/heatmap/run_httperf.sh <username> <password> 10000 100`
5. Wait for httperf to finish.
6. Press Ctrl+C in the `setup.sh` shell.
7. Wait until `flamegraph.svg` was generated (this might take 20min or longer). Do not interrupt this step.
8. Execute: `./benchmarks/backend/heatmap/get_statistics.sh`
9. Collect results:
   - flamgraph.svg
   - Copy request execution times and query execution times from stdout of `get_statistics.sh`
