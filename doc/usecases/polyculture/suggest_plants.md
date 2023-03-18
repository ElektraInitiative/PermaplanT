# Use Case: Plant suggestions

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user is provided with suggestions on which plants to use.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user has opened the app.
  - At least some of these layers are filled with data:
    - Hydrology
    - Terrain
    - Shadows
    - Soil
    - Trees
    - Winds
    - Zones
  - At least one plant is placed in the plants layer.
- **Main success scenario:**
  - A choice of plants that work well with the given environmental conditions and already placed plants is presented to the user.
  - Within those suggestions the user can see what plants go well with each other.
  - Plants that have a higher ecological value are highlighted.
- **Alternative scenario:**
- **Error scenario:**
  - In case of any technical error the users is notified about these.
  - When there are no matches due to too many constraints the user is informed that she has to remove a plant and try again.
- **Postcondition:**
  - The user has a selection of fitting plants to add to her garden.
- **Non-functional Constraints:**
  - Performance
