This directory contains the load testing scripts for the backend.
The tool used is [k6](https://k6.io/).

## Installation

Follow the guide in the [k6 installation docs](https://grafana.com/docs/k6/latest/get-started/installation/) depending on your operating system.

## Running

Replace the values in auth with your own PermaplanT credentials.
Navigate into the `./benchmarks/load-testing` directory.
Run `k6 run src/get-users.js` or any other script in the directory.

For a more detailed guide look into the [docs](https://grafana.com/docs/k6/latest/).
