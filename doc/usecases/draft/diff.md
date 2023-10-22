# Use Case: Diff

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** User, App
- **Brief:** The user can visualize differences between two dates.

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the desired layer (e.g. plants).
- **Main success scenario:**
  - The user clicks on the first date in the timeline.
  - The user double clicks on the second date in the timeline.
  - Plants that were added or removed between these dates are marked visually.
- **Alternative scenario:**
  - If no differences are available, a message is displayed.
- **Error scenario:**
  - There is an error in the app's difference calculation.
    In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  - Unless the user clicks on the timeline again, the user cannot add or remove plants.
- **Non-functional Constraints:**
  - None.
