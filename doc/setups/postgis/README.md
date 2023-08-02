# Postgis Docker

Instead of setting up psql server on your local machine, you could use a 'postgis' Docker container as another option.

[hub.docker postgis image](https://registry.hub.docker.com/r/postgis/postgis/)

Use `docker-compose.yml` in `/doc/setups/postgis` with the following command to start the container.

```shell
docker-compose up -d
```

It's worth noting that the PostGIS Docker image makes the permaplant user a 'superuser'.

Now, carry out the migration as you usually do.

If you want to use the psql CLI, use following command.

```shell
docker exec -ti postgis psql -U permaplant
```
