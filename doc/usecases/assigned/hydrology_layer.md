# Use Case: Hydrology Layer

## Summary

- **Scope:** Hydrology Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, removed and delete moisture or dry areas in their map in the moisture layer.
- **Assignee:** Daniel
- **Note:** Lowest priority of the layers

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the moisture layer.
- **Main success scenario:**
  - The user successfully adds, edits, moves, removes and deletes moisture or dry areas in the moisture layer.
    For example: surface water runoff, natural reservoirs, gullies, rills, etc.
    This includes positioning the areas in the appropriate location.
  - Moisture or dry areas can be added by a small (rills) or big brush (surface water) to draw on the moisture layer.
  - Arrows can be used to indicate water flow.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add, move or edit a moisture area but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, removed or deleted moisture areas as desired.
- **Non-functional Constraints:**
  - Performance: Map sizes with more than 1ha in 10000 raster elements (m²) per year should be usable without noticeable delays and acceptable memory overhead
