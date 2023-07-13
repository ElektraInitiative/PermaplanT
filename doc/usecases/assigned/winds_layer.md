# Use Case: Winds Layer

## Summary

- **Scope:** Wind Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, remove and delete wind orientation and areas in their map using the wind layer.

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the winds layer.
- **Main success scenario:**
  - The user successfully adds, edits, moves, remove and deletes wind areas in their map using the wind layer.
  - This includes positioning the areas in areas of the landscape that are more windy and adjusting the strength of the wind.
  - Wind areas can be added by a big brush to draw on the wind layer.
  - Main wind orientation can be indicated via an arrow.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add or edit a wind area but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, removed or deleted wind areas as desired.
- **Non-functional Constraints:**
  - Performance: Map sizes with more than 1ha in 100 raster elements (in 1a=100m²) per year should be usable without noticeable delays and acceptable memory overhead
