# Use Case: Layer Alternatives

## Summary

- **Scope:** All Layers
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User selects and modifies alternatives of a layer

## Scenarios

- **Precondition:**
  User has opened the app and a map.
- **Main success scenario:**

  - User chooses a layer to enable
  - User duplicates the layer
  - User gives the layer a name
  - User modifies the layer
  - User may select another alternative of the layer.
    This change doesn't affect layer selections of other users (that work on the same map).

- **Alternative scenario:**
  - User accidentally duplicates the layer and deletes the duplicate with "delete layer" functionality
  - User accidentally selects a wrong alternative as the current layer and undoes the action by selecting the correct layer
- **Error scenario:**
  - If the user encounters technical issues or errors while using the layer alternatives, the platform should display an error message and allows the user to try again.
- **Postcondition:**
  The user has successfully modified and selected an alternative of a layer.
- **Non-functional Constraints:**
  - Performance: up to 10 alternatives should be fast to use
  - Offline functionality depending on the layer
- **Note:**
  - Layers that support alternatives, have this specified as **non-functional constraint**.
