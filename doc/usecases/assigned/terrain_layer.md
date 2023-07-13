# Use Case: Terrain Layer

## Summary

- **Scope:** Terrain Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move and delete terrain levels in the terrain layer.

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the terrain layer.
- **Main success scenario:**

  - The user successfully sets the base level value for the terrain layer.
  - The user successfully adds, edits, moves and deletes terrain elements in the terrain layer.
    Terrain elements are, e.g.:
    - **Hill:** A hill is a terrain element that is higher than the base level.
    - **Valley:** A valley is a terrain element that is lower than the base level.
  - Terrain elements can be drawn using brushes of different sizes.
  - The height of the terrain elements should be represented by a color gradient.

- **Alternative scenario:**
  The user accidentally adds or edits an terrain element in the wrong location and uses the app's undo function to correct the mistake.
- **Error scenario:**
  The user attempts to add, move or edit an terrain element but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved or deleted terrain elements as desired.
- **Non-functional Constraints:**
  - Performance: Map sizes with more than 1ha in 10000 raster elements (m²) per year should be usable without noticeable delays and acceptable memory overhead
