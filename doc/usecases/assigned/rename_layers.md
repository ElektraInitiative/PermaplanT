# Use Case: Rename Layers

## Summary

- **Scope:** Created or Alternative Layers
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User renames created or alternative layers
- **Assignee:** Daniel
- **Simplification:** No support for alternative layers

## Scenarios

- **Precondition:**
  - User has opened the app and has at least one created or alternative layer.
- **Main success scenario:**
  User successfully renames created or alternative layers by selecting the desired layer and entering a new name.
- **Alternative scenario:**
  - The user accidentally renames a layer to a name that is already in use and uses the app's undo function to correct the mistake.
- **Error scenario:**
  - The user attempts to rename the layer but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
  - The user attempts to rename the layer to a name that is already in use and the app is unable to complete the request, displaying an error message.
  - The user attempts to rename the layer by entering a name that is longer than the maximum allowed length and the app is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user has changed the name of the selected layer.
- **Non-functional Constraints:**
