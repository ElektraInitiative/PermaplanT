# Use Case: Hydrology Layer

## Summary

- **Scope:** Hydrology Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, remove and delete wet or dry areas.
- **Assignee:** Daniel, Lukas

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the hydrology layer.
- **Main success scenario:**
  - The user successfully adds, edits, moves, removes and deletes dry, wet and watery areas in the hydrology layer.
    For example: surface water runoff, natural reservoirs, gullies, rills, etc.
    This includes positioning the areas in the appropriate location.
  - Default is moist.
  - Dry, wet and watery areas can be added by a small (rills) or big brush (surface water) to draw on the hydrology layer.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add, move or edit a moisture or dry area but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, removed or deleted moisture areas as desired.
- **Non-functional Constraints:**
  - Performance: Map sizes with more than 1ha in 10000 raster elements (m²) per year should be usable without noticeable delays and acceptable memory overhead
