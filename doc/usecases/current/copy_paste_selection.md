# Use Case: Copy & Paste of Selection

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can copy and paste a selection of elements, including succeeding crops, in their map
- **Status:** Merge Pending https://github.com/ElektraInitiative/PermaplanT/pull/356
- **Assignee:** Christoph N.

## Scenarios

- **Precondition:**
  The user has opened the app and has made a selection of elements that they want to copy and paste.
- **Main success scenario:**
  The user successfully copies and pastes the selection of elements, within the same map, between own maps or between an own map and a map of another user.
- **Alternative scenario:**
  The user accidentally pastes the selection in the wrong location and uses the app's undo function to correct the mistake.
- **Error scenario:**
  User attempts to copy and paste a selection but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user's map includes the copied and pasted selection of elements.
- **Non-functional Constraints:**
  - Alternatives (selected elements depend on which alternative layer is selected)
