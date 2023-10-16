# Use Case: Map Deletion

## Summary

- **Scope:** Map Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user deletes a map.
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
  The user has opened the app and is on the map management screen.
- **Main success scenario:**
  - The user delete a map by selecting it from the list of maps and confirming the deletion.
  - If the user decides to undo the deletion within one month, the map is restored.
- **Error scenario:**
  There is an error in the map deletion process and the map is not deleted as intended.
  In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The map is deleted.
- **Non-functional Constraints:**
