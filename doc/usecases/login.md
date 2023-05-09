# Use Case: Login

## Summary

- **Scope:** Authentication
- **Level:** User Goal
- **Actors:** App User, App System
- **Brief:** The user authenticates against the app to gain access to their account.
- **Status:** In Progress
- **Assignee:** Gabriel

## Scenarios

- **Precondition:** The user has not yet authenticated against the app.
- **Main success scenario:**
  - The user enters their Nextcloud login credentials and the app successfully authenticates them.
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
