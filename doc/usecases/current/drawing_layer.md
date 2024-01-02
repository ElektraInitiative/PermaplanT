# Use Case: Drawing Layer

## Summary

- **Scope:** Drawing Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** Users add, edit, move, remove and delete custom drawings.
- **Assignee:** Daniel

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the drawing layer.
- **Main success scenario:**
  - The user successfully adds, edits, moves, removes and deletes custom drawings of any color of following forms:
    - free drawings
    - ellipses
    - rectangles
    - polygons (consisting of lines and bezier helper-points, that can be created by dragging existing lines)
      - open without filling
      - closed with 3 different fillings
    - icons from Nextcloud
    - Arrows can be used to indicate water flow.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add, move or edit a drawing but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, removed or deleted drawings as desired.
- **Non-functional Constraints:**
  - Offline availability
  - New Layers can be created.
  - Performance: at least 1000 elements per year per drawing layer should be usable without noticeable delays and acceptable memory overhead
