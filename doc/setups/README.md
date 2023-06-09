# Setup scripts for PermaplanT

The setup guide for the whole backend can be found in [backend](../backend)

## keycloak

This setup uses the keycloak image packaged by bitnami.
More information can be found [here](https://hub.docker.com/r/bitnami/keycloak/#!)

### settings:

- admin user: admin
- admin password: admin

Start a keycloak instance with a persistent storage with:

```bash
docker compose up
```

Open <http://localhost:8081/admin>.  
Sign in with user `admin` and password `admin`.  
Click on `master` -> `Create Realm`.  
Name the realm `PermaplanT` and click `Create`.

Either import the frontend client configuration:

Click on `Clients` -> `Import client`.  
Click `Browse`
Select /doc/setups/keycloak/PermaplanT.json
Click `Save`

or manually create the client:

Click on `Clients` -> `Create client`.  
Set the `Client ID` to `PermaplanT`.
Click `Next` two times.  
Set values: `Root URL = http://localhost:5173`, `Valid redirect URIs = /*`, `Web origins = +`.  
Click `Save`.

Create a second client `swagger-ui` with `Root URL = http://localhost:8080/doc/api/swagger/ui` (everything else the same as above).

Go to `Users` and create a user `test`.  
Click `Credentials` and set password to `test`.

## nextcloud

Docker compose setup for nextcloud with mariadb:

Start the Nextcloud instance with:

```bash
docker compose up
```

## nginx (WIP)

This setup should spin up a Nextcloud instance behind a nginx reverse proxy with TLS enabled.
Https is required for Nextcloud to allow the login via Keycloak.

Although everything seems to work correctly the login with Keycloak fails anyways...

This means requests against the Nextcloud APIs have to be tested with a remote Nextcloud instance.
