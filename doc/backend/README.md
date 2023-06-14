# PermaplanT Backend

## Requirements

- Rust 1.67.1 or later ([Installation guide](../development_setup.md))
- [PostgreSQL](https://www.postgresql.org/download/) version 13 with PostGIS 3.1.1
- libpq-dev
- libssl-dev
- pkg-config


Instead of setting up psql server on your local machine, you could use a 'postgis' Docker container as another option.

## Docker

When you set it up, make sure you create a 'persistent data volume'. This means the data will stay safe, even if the container is stopped.
```shell 
docker volume create pg_data
```

Next, you will need to run a specific command to start the 'postgis' Docker container. This command will include the username, the password, and the name of your database 'permaplant'.

```shell 
docker run --name=postgis -d -e POSTGRES_USER=permaplant -e POSTGRES_PASSWORD=permaplant -e POSTGRES_DB=permaplant -e ALLOW_IP_RANGE=0.0.0.0/0 -p 5432:5432 -v pg_data:/var/lib/postgresql --restart=always postgis/postgis:13-3.3
```

If you want to use the psql cli, use following command.

```shell 
docker exec -ti postgis psql -U permaplant
```

## Additional Documentation

Details about the API documentation can be found [here](03api_documentation.md).

To view code documentation run the following in the `backend/` folder:

```shell
cargo doc --open
```
