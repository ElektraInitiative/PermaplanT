# Use Case: Map Timeline Single Selection

## Summary

- **Scope:** Map View
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can view the map at different points in time by using the timeline feature.
- **Assignee:** Paul

## Scenarios

- **Precondition:**
  - The user has opened the app and selected a map.
  - The date field shows the current date.
- **Main success scenario:**
  - The user selects a different date in the date field.
  - This allows navigation to a different point in the past, present and future.
  - The map updates to show the state of the garden at the selected point in time (removing or adding elements accordingly).
  - Adding or removing elements is done on the selected date.
- **Alternative scenario:**
  - The user corrects the dates in the attributes of elements or presses undo to undo changes in the dates.
- **Error scenario:**
- **Postcondition:**
  The user has successfully changed to the desired date.
- **Non-functional Constraints:**
  - Performance: data in up to 100 years should be fast to use
- **Note:**
  - Single Date Selection must always be an exact date so we have a well-known date (reference point) when elements got added to the map.
