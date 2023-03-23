# Use Case: Map Undo/Redo

## Summary

- **Scope:** All Layers
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can undo or redo their own actions to correct mistakes made to the map.
- **Status:** Needs Clarification (Collaborative/Offline Feasibility)
- **Assignee:** Paul

## Scenarios

- **Precondition:**
  The user has made a change in the map that they want to undo.
- **Main success scenario:**
  - The user selects the undo option.
  - The app successfully undoes the previous action that modified the map in some way.
- **Alternative scenario:**
  - The user used undo by accident.
  - In this case, the user can press redo, to undo the undo.
- **Error scenario:**
  There is an error in the app's undo/redo functionality and the action is not correctly undone or redone.
  In this case, the app displays an error message to the user and allows them to try again.
- **Postcondition:**
  The user's action within the map has been undone or redone as desired.
  It may be an action in a different layer.
- **Non-functional Constraints:**
  - The app must clearly communicate to the user whether an action can be undone or redone.
  - The app must clearly communicate which undo/redo action was done.
  - Offline availability
