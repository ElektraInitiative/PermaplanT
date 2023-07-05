# Use Case: Grid Layer

## Summary

- **Scope:** Grid Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The app will display a fixed scale coordinate grid.
- **Status:** Done
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
    - User has opened the map.
- **Main success scenario:**
    - The user sees a fixed scale coordinate grid with 10 centimeter spacing.
    - Lines that are a whole number of meters away from the origin are drawn boldly.
- **Non-functional Constraints:**
    - Support for changing viewport (zoom, position, etc.)
    - The functionality is only available in the frontend.