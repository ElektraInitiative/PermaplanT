# Use Case: Measuring Distance

## Summary

- **Scope:** All Layers
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can measure the distance between different elements in their map.
- **Status:** Draft

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the desired layer (e.g. plants, paths).
- **Main success scenario:**
  - The user selects the "Measure Distance" button.
  - The user clicks on the first point they want to measure the distance from.
  - The user clicks on the multiple elements where want to measure the path.
  - New measurements can be started in between.
  - The app displays all the measurements and the total sum in the desired unit (e.g. meters, feet).
- **Alternative scenario:**
  - The user accidentally clicks on the wrong element and can remove this element from the measurement.
  - The user started a new measurement in between by accident and can remove the start of the measurement.
- **Error scenario:**
  - There is an error in the app's distance measurement function and the displayed distance would not be accurate.
    In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The user has measured the distance between elements in their landscape plan as desired.
- **Non-functional Constraints:**
  - The app must accurately measure the distance between elements in the selected unit.
