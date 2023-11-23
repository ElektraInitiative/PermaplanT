# Use Case: Zoom

## Summary

- **Scope:** Zoom
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can zoom in and out on their landscape map to view details more clearly or get a better overview of their map.
- **Status:** Done

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the desired layer (e.g. plants, paths).
- **Main success scenario:**
  The user is able:
  - to set a scaling factor,
  - to zoom in on a specific area down to 10x10cm (lowest resolution), and
  - to zoom out to view a wider area up to 1000mx1000m.
- **Alternative scenario:**
  The user accidentally zooms in or out too far and uses the "Zoom Reset" button to return to the default zoom level.
- **Error scenario:**
  There is an error in the app's zoom functionality and the map is not displayed correctly at the selected zoom level.
  In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The user has zoomed in or out on their map as desired.
- **Non-functional Constraints:**
  - The app must accurately measure the distance between elements in the selected unit.
  - Offline availability (if zoom is within the range of previously used zoom anywhere on the map)
