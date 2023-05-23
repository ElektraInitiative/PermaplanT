# Use Case: Map Creation

## Summary

- **Scope:** Map Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user creates or duplicates a map.
- **Status:** Done
- **Assignee:** Thorben, Samuel (Photos)

## Scenarios

- **Precondition:**
  The user has opened the app and is on the map management screen.
- **Main success scenario:**
  - The user successfully creates or duplicates a new map by providing:
    - a name
    - a location (where that map is)
    - a text
    - a photo from Nextcloud (of that map)
    - privacy setting: public, protected (only members), private
    - soil (sandy to clay)
  - The same information can be later edited in a settings dialog.
- **Alternative scenario:**
  - The user attempts to create a map with a name that is already in use.
    In this case, the app displays an error message and prompts the user to choose a different name.
  - The user attempts to create a private map but doesn't have the permission to do so.
    In this case, the app displays an error message.
- **Error scenario:**
  There is an error in the map creation process and the map is not created as intended.
  In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The map is successfully created.
- **Non-functional Constraints:**
