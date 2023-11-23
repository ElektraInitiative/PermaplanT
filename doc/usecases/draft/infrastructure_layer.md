# Use Case: Infrastructure Layer

## Summary

- **Scope:** Infrastructure Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move and delete infrastructure elements in their plan.

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the infrastructure layer.
- **Main success scenario:**
  The user successfully adds, edits, moves and deletes infrastructure elements in the infrastructure layer.
  Infrastructure elements are, e.g.:
  - taps
  - wifi spots
  - water storage tanks
  - irrigation systems
    For placement:
  - positioning the elements in the appropriate locations
  - adjusting their properties
    as needed.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  The user attempts to add, move or edit an infrastructure element but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the added, edited, moved or deleted infrastructure elements as desired.
- **Non-functional Constraints:**
  - Performance: more than 500 elements per year should be usable without noticeable delays and acceptable memory overhead
