# Performance Benchmarks

TODO: better documentation

## Requirements

docker
nushell
perf
flamegraph
httperf
standard linux tools like 'grep', 'awk' or 'psql'

## Setup

Add the following to the end of `Cargo.toml`

```toml
[profile.release]
debug = true
```

## Scripts

You can find the scripts in `benchmark/backend/`.
They are supposed to be run from the repos root folder.
