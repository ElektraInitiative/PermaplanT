# Use Case: Undo/Redo

## Summary

- **Scope:** Undo/Redo
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can undo or redo their actions in the app to correct mistakes or revert changes
- **Status:** Draft

## Scenarios

- **Precondition:**
  The user has made a change in a single layer in the app that they want to undo or redo.
- **Main success scenario:**
  The user selects the undo or redo option and the app successfully undoes or redoes the previous action.
- **Alternative scenario:**  
  The user tries to undo or redo an action that cannot be undone or redone within the current layer.
  In this case, the app displays an error message to the user indicating that the action cannot be undone or redone within the current layer.
- **Error scenario:**
  There is an error in the app's undo/redo functionality and the action is not correctly undone or redone.
  In this case, the app displays an error message to the user and allows them to try again.
- **Postcondition:**
  The user's action within the current layer has been undone or redone as desired.
- **Non-functional Constraints:**
  - The app must clearly communicate to the user whether an action can be undone or redone.
  - The app must store the changes for undo/redo client-side and only persist them for the duration of the current session.
