# PermaplanT Backend

## Requirements

- Rust 1.67.1 or later ([Installation guide](../development_setup.md))
- [PostgreSQL](https://www.postgresql.org/download/) version 13 with PostGIS 3.1.1
- libpq-dev
- libssl-dev
- pkg-config

## Additional Documentation

Instead of setting up psql server on your local machine, you could use a 'postgis' Docker container.

Details about the setup can be found [here](/setups/postgis/)

Details about the API documentation can be found [here](03api_documentation.md).

To view code documentation run the following in the `backend/` folder:

```shell
cargo doc --open
```
