# Use Case: Soil Layer

## Summary

- **Scope:** pH Values Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, move, remove, delete and edit areas of pH values and soil weight class in their map using the soil layer

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the soil layer.
- **Main success scenario:**
  1. First the user globally tells a pH topsoil value, soil weight and yield grade.
  2. Then the user successfully adds, moves, removes, deletes and edits:
     - pH value areas for topsoil
     - pH value areas for subsoil
     - soil weight class
     - yield grade
       in their map using the soil layer, where it differs from the global value.
       This includes positioning the pH value areas in the appropriate locations and adjusting their values as needed.
       A big brush is used to draw on the soil layer.
  3. The user can check the values at individual spots by clicking on it.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to edit a soil weight class or pH value in a area that is not within the acceptable range and the app displays an error message.
  The previous values stay unmodified.
- **Postcondition:**
  The user's map includes the added, moved or edited pH value areas as desired.
- **Non-functional Constraints:**
  - The app must clearly communicate to the user the constraints for editing pH values in the soil layer.
- **Notes:**
  - pH values have one significant digit, not more (e.g. 4.5, 6.7, 8.4)
  - Performance: Map sizes with more than 1ha in 100 raster elements (in 1a=100m²) per year with 4 values per raster element should be usable without noticeable delays and acceptable memory overhead
