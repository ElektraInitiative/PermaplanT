# Use Case: Map-Specific Favorite Groups

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user changes a set of favorite plant groups per map.

## Scenarios

- **Precondition:**
  - The user is logged in to the app.
  - The plants layer is selected.
  - At least one plant is placed.
- **Main success scenario:**
  - The user adds a plant or a plant group to her list of favorites.
- **Alternative scenario:**
  - The user wants to reorder their list of favorite plant groups.
  - The user wants to remove favorite plant groups.
- **Error scenario:**
  - The user attempts to add a plant group that is already in their favorites.
  - The user attempts to remove a group that is not in the favorites.
- **Postcondition:**
  - The set of map-specific favorites has changed according to the changes the user made.  
    The state of these favorites can be seen in the plants layer.
- **Non-functional Constraints:**
  - It must be clear that a favorite was added or removed.
