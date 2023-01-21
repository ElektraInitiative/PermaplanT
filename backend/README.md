# PermaplanT Backend

## Requirements

- Rust 1.66.1 or higher
- PostgreSQL 14.6 or

## Installation

1. Rename `.env.sample` to `.env` and enter the data according to your setup.

2. Install Diesel CLI:

``` shell
cargo install diesel_cli --no-default-features --features postgres
```

3. Run the diesel setup, this makes sure that diesel will create the database if it doesn't exist yet and will run all migrations.

``` shell
diesel setup
```

4. Start the server:

``` shell
cargo run
```

## Usage

Now the server is running and will start listening at <http://localhost:8080/> (or whichever port you specified in `.env`).
