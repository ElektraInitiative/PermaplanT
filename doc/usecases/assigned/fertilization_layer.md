# Use Case: Fertilization Layer

## Summary

- **Scope:** Fertilization Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, remove and delete fertilizers in their map in the layer.
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the fertilization layer.
- **Main success scenario:**
  - The user successfully adds, edits, moves and removes fertilizers in their map in the fertilization layer.
  - Fertilizers can be drawn using brushes of different sizes.
  - The user can write a note which fertilization was used.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  - If the user encounters technical issues or errors while using the fertilization layer, the platform should display an error message and allow the user to try again.
- **Postcondition:**
  The user has successfully added, edited, moved, removed and deleted fertilizers in the fertilization layer.
- **Non-functional Constraints:**
  - Non-semantic
  - Offline availability
  - Performance: Map sizes with more than 1ha in 10000 raster elements (m²) per year should be usable without noticeable delays and acceptable memory overhead
