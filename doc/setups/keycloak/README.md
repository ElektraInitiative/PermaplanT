# Local Keycloak Setup

## Start Keycloak

Via docker run:

`docker run -p 8081:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:21.1.1 start-dev`

or use the `docker-compose.yml` to start keycloak with persistent storage via

```bash
docker compose up
```

more about the docker compose setup can be found in [/doc/setups/README.md]()

## Setup Keycloak:

Open <http://localhost:8081/admin>.  
Sign in with user `admin` and password `admin`.  
Click on `master` -> `Create Realm`.  
Name the realm `PermaplanT` and click `Create`.

Click on `Clients` -> `Create client`.  
Set the `Client ID` to `PermaplanT`.
Click `Next` two times.  
Set values: `Root URL = http://localhost:5173`, `Valid redirect URIs = /*`, `Web origins = +`.  
Click `Save`.

Create a second client `swagger-ui` with `Root URL = http://localhost:8080/doc/api/swagger/ui` (everything else the same as above).

Go to `Users` and create a user `test`.  
Click `Credentials` and set password to `test`.

## Setup the Keycloak Admin REST API (for collaboration & users endpoints):

Make sure you are on the `master` realm.
Click on `Clients` -> `Create client`.  
Set the `Client ID` to `permaplant-server`.  
Click `Next`.  
Switch on `Client authentication`.  
Under `Authentication flow` uncheck everything but `Service account roles`.  
Click `Next` and `Save`.  
Under `Clients` chose the newly created `permaplant-server` client.  
Under `Service account roles` assign the role `admin`.  
From `Credentials` copy the `Client secret` into the related `AUTH_ADMIN_CLIENT_SECRET` environment variable.  
Copy `permaplant-server` into the related `AUTH_ADMIN_CLIENT_ID` environment variable.
