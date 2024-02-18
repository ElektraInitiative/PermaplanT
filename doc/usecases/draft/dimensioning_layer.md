# Use Case: Dimensioning Layer

## Summary

- **Scope:** Dimensioning Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can put dimensioning between elements.

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the dimensioning layer.
- **Main success scenario:**
  - The user selects elements.
  - A line with arrows at the end and the distance in the middle gets added to the dimensioning layer.
- **Alternative scenario:**
  - The user accidentally clicks on the wrong element and can remove the dimensioning.
- **Error scenario:**
  - There is an error in the app's distance measurement function and the displayed distance would not be accurate.
    In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  Dimensions are added.
- **Non-functional Constraints:**
  - Non-semantic
  - Must be printable.
  - New Layers can be created.
  - Performance: at least 100 elements per year should be usable without noticeable delays and acceptable memory overhead
