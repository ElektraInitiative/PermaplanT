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
  - The user deletes a map by selecting it from the list of maps.
  - The user confirms the deletion with the information:
    - a warning that the whole map including all layers will be deleted, but
    - it is possible to contact the PermaplanT service team within one month to restore the map.
  - Within one month, the PermaplanT service team can restore the map via provided SQL commands.
- **Error scenario:**
  There is an error in the map deletion process and the map is not deleted as intended.
  In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The map is deleted.
- **Non-functional Constraints:**
