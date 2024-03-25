# Use Case: Shade Layer

## Summary

- **Scope:** Shade Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, remove and delete shade areas in their map in the shade layer and adjust the intensity.
- **Assignee:** Moritz, Daniel (Brush)
- **Simplification:** we don't distinguish between Winter and Summer shade

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the shade layer.
- **Main success scenario:**
  The user successfully adds, edits, moves, removes and deletes shade areas in their map in the shade layer.
  This includes positioning the indicators in areas of the landscape that receive more or less sun exposure and adjusting the intensity of the shade area.
  Shade areas can be added by a big brush to draw on the shade layer.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add or edit a shade area but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, removed or deleted shade area as desired.
- **Non-functional Constraints:**
  - Performance: Map sizes with more than 1000 shadings in 1ha in 10000 raster elements (m²) per year should be usable without noticeable delays and acceptable memory overhead
