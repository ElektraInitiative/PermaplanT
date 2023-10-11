# Use Case: Map Timeline Event View

## Summary

- **Scope:** Map View
- **Level:** User Goal
- **Actors:** User, App
- **Brief:** The user sees addition/removal of elements as events using the timeline feature.
- **Assignee:** Daniel Steinkogler

## Scenarios

- **Precondition:**
  The user has opened the app and selected a map.
- **Main success scenario:**
  - The user sees events represented on the scrollbar of the timeline feature, allowing them to understand how the map changed over time.
    Events include:
    - addition of an element to the map (colored green)
    - removal of an element from the map (colored red)
  - the events are represented by a visual indication directly at the day/month/year on the sliders.
  - the timeline can be scaled vertically for touch screen usage.
  - if there is no event at a certain point in time, the graph is empty. That means that 0 events should lead to no visual indication, so that 0 and 1 can be easily distinguished.
- **Alternative scenario:**
  - The user has not yet added/removed any elements, therefore no events are visible on the timeline.
- **Error scenario:**
  There is an error in the timeline display or event loading functionality.
  In this case, the app displays an error message and allows the user to try again.
- **Postcondition:**
  The user successfully sees the events on the timeline scrollbar.
- **Non-functional Constraints:**
  - Offline availability
