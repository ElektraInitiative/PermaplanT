# PermaplanT Backend

## Requirements

- Rust 1.66.1
- [PostgreSQL](https://www.postgresql.org/download/) version 13 or later
- libpq-dev

## Installation

1. Rename `.env.sample` to `.env` and enter the data according to your setup.

- `DATABASE_URL` is the Connection [URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) to your PostgreSQL database
- `BIND_ADDRESS_HOST` defines the host on which the server will run on
- `BIND_ADDRESS_PORT` defines the port on which the server will run on

2. Install Diesel CLI:

``` shell
cargo install diesel_cli --no-default-features --features postgres
```

3. Run the diesel setup, this makes sure that diesel will create the database if it doesn't exist yet and will run all migrations.

``` shell
LC_ALL=C diesel setup
```

4. Install the typeshare cli to enable type safety between Rust and TypeScript:

``` shell
cargo install typeshare-cli
```

5. Start the server:

``` shell
cargo run
```

## Usage

Now the server is running and will start listening at <http://localhost:8080/> (or whichever port you specified in `.env`).

Example requests:

- `curl localhost:8080/api/varieties`
