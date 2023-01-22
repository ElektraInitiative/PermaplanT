# Use Case: Soil Layer

## Summary

- **Scope:** pH Values Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, move, delete and edit areas of pH values and soil weight class in their map using the soil layer
- **Status:** Draft

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the soil layer.
- **Main success scenario:**
  1. First the user globally tells a pH topsoil value, soil weight and yield grade.
  2. Then the user successfully adds, moves, deletes and edits:
     - pH value areas for topsoil
     - pH value areas for subsoil
     - soil weight class
     - yield grade
     in their map using the soil layer, where it differs from the global value.
     This includes positioning the pH value areas in the appropriate locations and adjusting their values as needed.
     A big brush is used to draw on the soil layer.
  3. The user can check the values at individual spots by clicking on it.
- **Alternative scenario:**
  The user accidentally adds or moves a pH values or soil weight classes in the wrong location and uses the app's undo function to correct the mistake.
- **Error scenario:**
  The user attempts to edit a soil weight class or pH value in a area that is not within the acceptable range and the app displays an error message.
  The previous values stay unmodified.
- **Postcondition:**
  The user's map includes the added, moved or edited pH value areas as desired.
- **Non-functional Constraints:**
  - The app must clearly communicate to the user the constraints for editing pH values in the soil layer.
- **Notes:**
  - pH values have one significant digit, not more (e.g. 4.5, 6.7, 8.4)
