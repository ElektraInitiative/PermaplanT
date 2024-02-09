# Use Case: Grid

## Summary

- **Scope:** Grid
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The app will display a variable scale coordinate grid.
- **Status:** Done
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
  - User has opened the map.
- **Main success scenario:**
  - The user sees a variable scale coordinate grid with 1 meter, 10 meter and 10 centimeter spacings depending on the current map scale.
  - A yard stick displays the current scale of the coordinate grid.
  - The origin point is marked on the map.
  - The grid can be toggled on and of using a button in the top right toolbar.
- **Non-functional Constraints:**
  - Support for changing viewport (zoom, position, etc.)
  - The functionality is only available in the frontend.
