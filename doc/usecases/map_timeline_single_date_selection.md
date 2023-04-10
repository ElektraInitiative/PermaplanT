# Use Case: Map Timeline Single Date Selection

## Summary

- **Scope:** Map View
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can view the map at different points in time by using the timeline feature.
- **Status:** Assigned
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
  The user has opened the app and selected a map.
- **Main success scenario:**
  - The user selects the timeline view and uses the scroll bar with a day granularity or date field.
  - This allows navigation to a different point in the past, present and future.
  - The map updates to show the state of the garden at the selected point in time (removing or adding elements accordingly).
  - The scroll bar visually indicates in which points there are changes and at which points the map is empty (without plants).
  - Hovering over the scroll bar hints which month would be selected on a click.
- **Alternative scenario:**
- **Error scenario:**
  There is an error in the timeline display or navigation functionality.
  In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The user has successfully navigated to the desired date on the timeline.
- **Non-functional Constraints:**
  - Performance: data in up to 100 years should be fast to use
