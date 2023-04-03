# Use Case: Map Timeline Event View

## Summary

- **Scope:** Map View
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can see the addition/removal of elements as events using the timeline feature, allowing them to understand how the map changed over time.
- **Status:** Draft

## Scenarios

- **Precondition:**
  The user has opened the app and selected a map.
- **Main success scenario:**
  - The user sees events represented on the scrollbar of the timeline feature.
  Events include:
    - addition of an element to the map
    - deletion of an element from the map
  - The timeline can be scaled with the mouse wheel, adjusting it's start and end date, thus showing more events of the future and the past.
  - 

- **Alternative scenario:**
  - The user has not yet added/removed any elements, therefore no events are visible on the timeline.
  - The timeline is scaled to encompass +/- three years, and the center is this present day.
- **Error scenario:**
  There is an error in the timeline display or event loading functionality. 
  In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The user successfully sees the events on the timeline scrollbar.
- **Non-functional Constraints:**
  - Offline availability
