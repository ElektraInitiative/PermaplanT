# Use Case: Grid

## Summary

- **Scope:** Grid
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The app will display a coordinate grid.
- **Status:** Done
- **Assignee:** Moritz
- **Protocol:** doc/tests/manual/protocol.md TC-013
- **Implementation:** frontend/src/features/layers/_frontend_only/grid 

## Scenarios

- **Precondition:**
    - User has opened the map.
- **Main success scenario:**
    - The user sees a coordinate grid with 1 meter, 10 meter or 10 centimeter spacing depending on the current zoom level.
- **Non-functional Constraints:**
    - Support for changing viewport (zoom, position, etc.)
    - The functionality is only available in the frontend.