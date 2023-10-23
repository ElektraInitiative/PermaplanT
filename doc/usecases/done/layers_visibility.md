# Use Case: Layer Visibility

## Summary

- **Scope:** All Layers
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User changes the visibility of layers in their map
- **Assignee:** Samuel

## Scenarios

- **Precondition:**
  User has opened the app and has multiple layers available to view.
- **Main success scenario:**
  User successfully changes the visibility of layers:
  - visibility on/off (elements and colors on layer are fully visible or invisible)
  - opacity in % (elements and colors on layer have a chosen opacity)
- **Error scenario:**
  The user attempts to toggle the visibility but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The user has changed the visibility of the selected layer.
- **Non-functional Constraints:**

- **improvements**
- **Alternative scenario:**
  - On activation of a layer, also the visibility gets turned on.
  - On activation of some layers, the visibility of others layer changes; e.g.,
    activation of the [moisture layer](../assigned/hydrology_layer.md) also sets the visibility of the [infrastructure layer](../draft/infrastructure_layer.md) to on.

## Notes

The layer opacity is a Konva feature and is implemented in [Map.tsx](https://github.com/ElektraInitiative/PermaplanT/tree/master/frontend/src/features/map_planning/components/Map.tsx).
The control elements for the opacity and visibility can be found in [LayerListItem.tsx](https://github.com/ElektraInitiative/PermaplanT/tree/master/frontend/src/features/map_planning/components/toolbar/LayerListItem.tsx)
