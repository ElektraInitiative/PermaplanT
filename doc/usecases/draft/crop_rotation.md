# Use Case: Crop Rotation

## Summary

- **Scope:** Crop Rotation
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user gets information for selecting plant locations based on removed plants and their compatibility.

## Scenarios

- **Precondition:**
  - The user has opened the app and selected the planting layer.
- **Main success scenario:**
  - The user performs the scenario described in the [Linked Use Case](../draft/heatmap+relation_layer_extensions.md).
  - The information that is used to display the best position of the plant is substituted by the compatability between the already removed, previously existing plants and the selected plant that should be planted now.
  - This can be a positive relation (synergy) or a negative relation (antagonist) which can last a predefined number of years (also only half a year) starting after the removal of the previous plant.
- **Error scenario:**
  - When not having any data for a selected pair of plants, nothing happens for the user and no additional information for selecting locations is provided.
- **Postcondition:**
- **Linked Use Cases:**
  - [Heatmap and Relation Layer Extensions](../draft/heatmap+relation_layer_extensions.md)
