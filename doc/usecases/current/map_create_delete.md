# Use Case: Map Creation and Deletion

## Summary

- **Scope:** Map Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can create and delete maps within the app, with the option to undo a deletion for a limited time period.
- **Status:** Done (Without Deletion)
- **Assignee:** Thorben

## Scenarios

- **Precondition:**
  The user has opened the app and is on the map management screen.
- **Main success scenario:**
  - The user successfully creates a new map by providing a name and selecting any desired customization options.
    The map itself can be either:
    - empty
    - a duplication of an existing map
  - The user can also delete a map by selecting it from the list of maps and confirming the deletion.
  - If the user decides to undo the deletion within one month, the map is restored.
- **Alternative scenario:**
  - The user attempts to create a map with a name that is already in use.
    In this case, the app displays an error message and prompts the user to choose a different name.
  - The user attempts to create a private map but doesn't have the permission to do so.
    In this case, the app displays an error message.
- **Error scenario:**
  There is an error in the map creation or deletion process and the map is not created or deleted as intended.
  In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The user's desired changes to the map list have been successfully made.
- **Non-functional Constraints:**
