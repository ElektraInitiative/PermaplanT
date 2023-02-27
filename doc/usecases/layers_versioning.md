# Use Case: Layer Versioning

## Summary

-   **Scope:** All Layers
-   **Level:** User Goal
-   **Actors:** App User
-   **Brief:** User modifies and switches between different versions of a layer
-   **Status:** Draft

## Scenarios

-   **Precondition:**
    User has opened the app and has multiple layers available to view.
-   **Main success scenario:**

    -   User chooses a layer to modify
    -   User duplicates the layer
    -   User modifies the layer
    -   User saves the layer as a new version
    -   User switches between different versions of the layer
    -   User marks a version as the current version

-   **Alternative scenario:**
    -   User accidentally duplicates the layer and deletes the duplicate with "delete version" functionality
    -   User accidentally marks a version as the current version and undoes the action by switching and marking a different version as the current version
-   **Error scenario:**
    -   If the user encounters technical issues or errors while using the layer versioning, the platform should display an error message and allow the user to try again.
-   **Postcondition:**
    The user has successfully modified and switched between different versions of a layer.
-   **Non-functional Constraints:**
