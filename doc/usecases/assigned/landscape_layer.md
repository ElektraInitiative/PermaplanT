# Use Case: Landscape Layer

## Summary

- **Scope:** Landscape Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User adds elements to their map using hand-drawn shapes or common shapes.
- **Assignee:** Daniel

## Scenarios

- **Precondition:** User has opened the app and selected the landscape layer.
- **Main success scenario:**
  User successfully adds elements to their map using hand-drawn shapes or common shapes such as circles, ellipses, squares, and rectangles.
  Element types include:
  - wall
  - plain
  - pond
  - (glas)houses
  - barns
  - plant beds
- **Alternative scenario:**
  User accidentally adds a shape in the wrong location and uses the app's undo function to correct the mistake.
- **Error scenario:**
  User attempts to add a shape but the app is experiencing technical difficulties and is unable to process the request, displaying an error message.
- **Postcondition:**
  The user's map includes elements added using hand-drawn or common shapes.
- **Non-functional Constraints:**
  - Performance: more than 200 elements per year should be usable without noticeable delays and acceptable memory overhead
