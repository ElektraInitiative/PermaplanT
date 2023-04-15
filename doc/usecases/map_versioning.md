# Use Case: Map Versioning

## Summary

- **Scope:** All Layers
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User saves and loads different versions of a map
- **Status:** In Progress
- **Assignee:** Thorben

## Scenarios

- **Precondition:**
  User has opened the app and a map.
- **Main success scenario:**

  - User saves the current version of the map.
  - User gives the version a name (optional).
  - User modifies the map.
  - User loads another version of the map by selecting
    -      the name or time of a version, and
    -      which layers should be loaded.

- **Alternative scenario:**
  - User doesn't save the current version of the map.
  - In this case, the current version automatically gets saved:
    -      hourly (for last 7 hours),
    -      daily (for last 7 days) and
    -      after logout/disconnect of every user.
- **Error scenario:**
  - If the user encounters technical issues or errors while loading a version, the platform should display an error message and allows the user to try again.
- **Postcondition:**
  The map is exactly like at that time when the version was (automatically) saved.
- **Non-functional Constraints:**
  - Must also work on concurrent use of the same map (users can undo what others did).
