# Use Case: Login

## Summary

- **Scope:** Authentication
- **Level:** User Goal
- **Actors:** App User, App System
- **Brief:** The user authenticates against Keycloak to gain access to their account.
- **Status:** Done
- **Assignee:** Gabriel, Samuel

## Scenarios

- **Precondition:** The user has not yet authenticated against Keycloak.
- **Main success scenario:**
  - The user enters their login credentials and Keycloak successfully authenticates them.
  - Alternatively, they go to a permalink for their user or map, where no login is needed.
- **Alternative scenario:**
  The user enters incorrect login credentials.
  In this case, the app displays an error message to the user indicating that the login failed.
- **Error scenario:**
  There is an error in the app's authentication process.
  In this case, the app displays an error message to the user and tells them to try again.
- **Postcondition:**
  - The user is authenticated and has access to the PermaplanT app.
  - The user is authenticated and has access to Nextcloud.
- **Non-functional Constraints:**
  - The login process must be secure to protect the user's personal information.
  - The app must clearly communicate to the user whether the login was successful or not.

## Links

- [Authentication Setup](../../research/nextcloud_integration.md)
- [Authentication Decision](../../decisions/auth.md)

## Left-Overs

- [Add an auth mechanism to the /api/updates/maps endpoint](https://github.com/ElektraInitiative/PermaplanT/issues/409)
