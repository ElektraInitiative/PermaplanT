# PermaplanT Backend

## Requirements

- Rust 1.67.1 or later ([Installation guide](../doc/development_setup.md))
- [PostgreSQL](https://www.postgresql.org/download/) version 13 or later
- [Keycloak](https://www.keycloak.org/getting-started/getting-started-docker) (run the container, but change the port to 8081)
- libpq-dev
- libssl-dev
- pkg-config

## Installation

1. Rename `.env.sample` to `.env` and enter the data according to your setup.

- `DATABASE_URL` is the Connection [URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) to your PostgreSQL database
- `BIND_ADDRESS_HOST` defines the host on which the server will run on
- `BIND_ADDRESS_PORT` defines the port on which the server will run on
- `AUTH_DISCOVERY_URI` the .well-known endpoint of the auth server (see [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414.html#section-2) for more detail)
- `AUTH_CLIENT_ID` the client id the frontend should use to log in

Ensure that you grant the necessary permissions for the user to use Postgres. One way to do this is by using the following command:

```shell
sudo -u postgres psql
CREATE USER permaplant WITH CREATEDB PASSWORD 'permaplant';
```

2. Install Diesel CLI:

```shell
cargo install diesel_cli --no-default-features --features postgres
```

3. Run the diesel setup, this makes sure that diesel will create the database if it doesn't exist yet and will run all migrations.

```shell
LC_ALL=C diesel setup
```

4. Run diesel migrations, to bring the database up to date with the current schema.

```shell
LC_ALL=C diesel migration run
```

5. Install the typeshare cli to enable type safety between Rust and TypeScript:

```shell
cargo install typeshare-cli
```

6. Start Keycloak

You can do one of the following two steps, the first one being the simpler one, but with less configuration options.

- To use the preconfigured Keycloak instance simply copy the newest version of `.env.sample` to `.env`
- To use the local Keycloak variant follow the steps in [/doc/setups/keycloak/](/doc/setups/keycloak/README.md)  
  You then also have to change following two env variables in `.env`
  - `AUTH_DISCOVERY_URI=http://localhost:8081/realms/PermaplanT/.well-known/openid-configuration`
  - `AUTH_CLIENT_ID=PermaplanT`

7. Run the backend

```bash
cargo run
```

### Test server using Swagger

- Go to <http://localhost:8080/doc/api/swagger/ui/>.  
  If you try to execute a request now it should return error 401.
- Click `Authorize`.

- Use the `authorizationCode` auth flow.
- Enter client_id `swagger-ui` (client_secret is empty) and click `Authorize`.
- Enter user credentials (username: `test`, password: `test`).
- You should now be able to execute a request in Swagger.

## Documentation

To view an interactive API documentation go to <http://localhost:8080/doc/api/swagger/ui/>.
Alternatively there is a [OpenAPI specification](https://spec.openapis.org/oas/latest.html) in json format at <http://localhost:8080/doc/api/openapi.json>.

To view code documentation run

```shell
cargo doc --open
```
