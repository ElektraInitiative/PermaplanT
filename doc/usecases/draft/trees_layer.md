# Use Case: Trees Layer

## Summary

- **Scope:** Trees Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, remove and delete forests, trees and, hedge bushes in their map.
- **Simplification:** For first version it is identical to the plants layer (so any plants can be planted)

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the trees layer.
- **Main success scenario:**
  The user successfully adds, edits, moves, removes and deletes forests, trees and, hedge bushes in their map in the trees layer.
  This includes:
  - positioning the stems (visible brown circle),
  - sketching the shape (transparent green, also allows other stems and plants shine through),
  - adjusting the height, and specifying the type of tree or bush.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add or edit forests, trees and, hedge bushes but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved, removed or deleted forests, trees and, hedge bushes as desired.
- **Non-functional Constraints:**
  - Supports alternatives
  - Performance: more than 500 elements per year and alternative should be usable without noticeable delays and acceptable memory overhead
