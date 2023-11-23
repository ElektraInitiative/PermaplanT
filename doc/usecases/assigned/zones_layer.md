# Use Case: Zones Layer

## Summary

- **Scope:** Zones Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, remove and delete zones in their map in the zones layer.
- **Assignee:** Daniel

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the zones layer.
- **Main success scenario:**
  The user successfully adds, edits, moves, remove and deletes zones in their map in the zones layer.
  This includes positioning the zones in the appropriate location.
  Zones can be added via common shapes, hand drawn polygons or a big brush to draw on the zones layer.
  The zones exclude each other (different to e.g. animals, where they can overlap).
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add, move or edit a zone but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, remove or deleted zone elements as desired.
- **Non-functional Constraints:**
  - Supports alternatives (different perspectives, e.g. guests)
  - Performance: Map sizes with more than 1ha in 10000 raster elements (m²) per year should be usable without noticeable delays and acceptable memory overhead
