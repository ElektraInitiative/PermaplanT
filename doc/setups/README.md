# Setup scripts for PermaplanT

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

Click on `Clients` -> `Import client`.  
Click `Browse`
Select /doc/setups/keycloak/PermaplanT.json
Click `Save`

# TODO: add backend client

Go to `Users` and create a user `test`.  
Click `Credentials` and set password to `test`.
