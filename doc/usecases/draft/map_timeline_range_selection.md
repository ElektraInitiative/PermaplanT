# Use Case: Map Timeline Range Selection

## Summary

- **Scope:** Map View
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can view the map over a range of consecutive points in time by using the timeline feature.

## Scenarios

- **Precondition:**
  The user has opened the app and selected a map.
- **Main success scenario:**
  - The user selects the timeline view and uses the scroll bar with a day/month/year granularity, or a date input that allows date range selection.
  - Using the scroll bar, the user clicks and drags the mouse to span a range of dates.
  - The user can only drag the selection up to the furthest event that happened in the past or the future.
  - Dragging over the scroll bar hints which day/month/year represents the start and which the end of the selected date range.
  - Finalizing the date selection updates the map to show the state of the garden over a range of points in time.
  - Elements on the map that do not exist over the whole range of dates, appear grey.
  - Elements on the map can be edited/moved/deleted, but not be added or removed.
- **Alternative scenario:**
- **Error scenario:**
  - There is an error in the timeline display or navigation functionality.
    In this case, the app displays an error message and allows the user to try again.
  - The user tries to add/remove elements while being in the active date range.
    In this case, the app displays an error message that adding/removing elements is not allowed.
- **Postcondition:**
  The user successfully sees the map containing the elements in the desired range of dates.
- **Non-functional Constraints:**
  - Offline availability only within the current year
  - Memory usage (other years get unloaded after some time if they are not used)
  - Performance
