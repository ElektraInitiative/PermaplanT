# Use Case: Layer Visibility

## Summary

- **Scope:** All Layers
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User changes the visibility of layers in their map
- **Status:** Done
- **Assignee:** Samuel

## Scenarios

- **Precondition:**
  User has opened the app and has multiple layers available to view.
- **Main success scenario:**
  User successfully changes the visibility of layers:
  - visibility on/off (elements and colors on layer are fully visible or invisible)
  - opacity in % (elements and colors on layer have a chosen opacity)
- **Alternative scenario:**
  - On activation of a layer, also the visibility gets turned on.
  - On activation of some layers, the visibility of others layer changes; e.g.,
    activation of the [moisture layer](moisture_layer.md) also sets the visibility of the [infrastructure layer](layers/infrastructure_layer.md) to on.
- **Error scenario:**
  The user attempts to toggle the visibility but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user has changed the visibility of the selected layer.
- **Non-functional Constraints:**
