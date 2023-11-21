# Use Case: Area of Plants

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move and delete plant areas elements in their map in the plants layer.

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the plants layer.
- **Main success scenario:**
  - While adding a plant, while holding the mouse, the user can draw a rectangle.
  - The size of the arena and the number of plants is shown next to the mouse.
  - When overlapping with other elements, it is visually indicated.
- **Alternative scenario:**
  The user accidentally drew a wrong size of the area:
  - and uses the app's undo function to correct the mistake
  - or is able to change the size as wanted.
- **Error scenario:**
  - The user attempts to add, move or edit a plant area element but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
  - There is an error in the app's plant relationship indication and the lines connecting the plants are not displayed correctly. In this case, the app displays an error message.
- **Postcondition:**
  - The user's map includes the added, edited, moved or deleted plant area element as desired.
  - If constraints are violated for the place where a plant was added or moved, warnings get added (or removed) to (from) the [warnings layer](../assigned/warnings_layer.md).
- **Non-functional Constraints:**
  - Partial offline availability: editing attributes, especially for planting and harvesting
  - Supports alternatives
  - Performance: more than 10000 elements per year and per alternative should be usable without noticeable delays and acceptable memory overhead
