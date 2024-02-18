# Use Case: Habitats Layer

## Summary

- **Scope:** Habitats Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, removed and delete habitats of animals to support their plants and ecosystem in their map in the habitats layer.

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the habitats layer.
- **Main success scenario:**
  - The user successfully adds, edits, moves, removes and deletes aids in their map in the habitats layer.
    For example: nesting aids, heaps of stones or leaves, perches etc.
    This includes positioning the aids in the appropriate location.
  - Habitats from deers and domesticated animals (like ducks and chicken) can be added by a big brush to draw on the habitats layer.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add, move or edit an aid but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, removed or deleted habitats as desired.
- **Non-functional Constraints:**
  - Performance: Map sizes with more than 1ha in 10000 raster elements (m²) and more than 500 elements per year should be usable without noticeable delays and acceptable memory overhead
