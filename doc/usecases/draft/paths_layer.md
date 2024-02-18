# Use Case: Paths Layer

## Summary

- **Scope:** Paths Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, remove and delete a connected network of paths and fences in their map in the paths layer.

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the paths layer.
- **Main success scenario:**
  The user successfully adds, edits, moves, removes and deletes a connected network of paths and fences in their map in the paths layer with:
  - the chosen path thickness (small way, ... large road)
  - the chosen type (stepping stones, wood chips, gravel, sealed)
    This includes positioning the connected network of paths and fences in the appropriate location.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add, move or edit a connected network of paths and fences but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, removed or deleted connected network of paths and fences as desired.
- **Non-functional Constraints:**
  - Non-semantic
  - Performance: more than 100 elements per year should be usable without noticeable delays and acceptable memory overhead
