# Use Case: Measuring Distance

## Summary

- **Scope:** All Layers
- **Level:** User Goal
- **Actors:** User, App
- **Brief:** The user can measure the distance between different elements in their map.
- **Status:** Assigned
- **Simplification:** Measuring only of pixels (not via backend as described in `Non-functional Constraints`)
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the desired layer (e.g. plants, paths).
- **Main success scenario:**
  - The user selects the "Measure Distance" button.
  - The user clicks on the first point they want to measure the distance from.
  - The user clicks on the multiple elements between which the user wants to create the path of the length measurement.
  - The App displays all the measurements and the total sum in the desired unit (e.g. meters, feet).
  - New measurements can be started while keeping the previous measurements on the display.
- **Alternative scenario:**
  - The user accidentally clicks on the wrong element and can remove this element from the measurement.
  - The user started a new measurement in between by accident and can remove the start of the measurement.
- **Error scenario:**
  - There is an error in the app's distance measurement function and the displayed distance would not be accurate.
    In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  No change on the elements of the map.
- **Non-functional Constraints:**
  - The app must accurately measure the distance between elements in the selected unit (based on GIS data).
