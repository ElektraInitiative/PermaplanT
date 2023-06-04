# API documentation

There are multiple variants of the API documentation:

- Production: <https://www.permaplant.net/doc/api/swagger/ui/>.
- PR: <https://pr.permaplant.net/doc/api/swagger/ui/>.
- Dev: <https://dev.permaplant.net/doc/api/swagger/ui/>.
- Local: <http://localhost:8080/doc/api/swagger/ui/> (you have to have the backend running locally for this).

## Executing requests

You can test requests to the backend directly via Swagger.  
For most endpoints you have to be authenticated for them to work.  
In Swagger you can do this like the following:

- Open the API documentation.  
  If you try to execute the seeds GET request now it should return error 401.
- Click `Authorize`.

- Use the variant with header `oauth2 (OAuth2, authorizationCode)`.
- Enter the `client_id`. You have to use a different one depending on the location:
  - Production: `PermaplanT-Prod`.
  - PR: `PermaplanT-PR`.
  - Dev: `PermaplanT-Dev`.
  - Local:
    - `local-swagger-ui` if you use the preconfigured Keycloak instance.
    - If you configured Keycloak yourself you have to create a client matching the URL.
- Enter your user credentials.
- You should now be able to execute a request in Swagger.
