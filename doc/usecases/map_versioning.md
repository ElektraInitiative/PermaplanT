# Use Case: Map Versioning

## Summary

-   **Scope:** All Layers
-   **Level:** User Goal
-   **Actors:** App User
-   **Brief:** User saves and loads different versions of a layer
-   **Status:** Draft

## Scenarios

-   **Precondition:**
    User has opened the app and a map.
-   **Main success scenario:**

    -   User saves the current version of the map.
    -   User gives the version a name.
    -   User modifies the map.
    -   User loads another version of the map by selecting the name or time of a version.

-   **Alternative scenario:**
    -   User doesn't save the current version of the map.
    -   In this case, the user can still select hourly (for last 7 hours) or daily (for last 7 days) versions.
-   **Error scenario:**
    -   If the user encounters technical issues or errors while loading a version, the platform should display an error message and allows the user to try again.
-   **Postcondition:**
    The map is exactly like at that time when the version was saved.
-   **Non-functional Constraints:**
    - Must also work on concurrent use of the same map (users can undo what others did).
