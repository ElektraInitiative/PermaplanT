# Use Case: Plants Layer

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move, remove, and delete plant elements in their map in the plants layer.
- **Assignee:** Paul

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the plants layer.
- **Main success scenario:**
  - The user is presented with a list of seasonal plants (for the selected time of the year), in following groups:
    - available seeds with early expiration days first
    - diversity constraints: suggestions which not-yet-used plants fit next to the plant just added, or at a place selected (spatial and temporal)
    - which were recently planted
    - and lastly favourites of users
  - While the user adds a plant, constraints are shown:
    - The user gets a visual indication which parts of the map are ideal, okay and not suited for the plant to be placed
      (based on e.g. previous plants, zones, pH value, moisture, animals or shadows).
    - The user is able to view the relationships between the plants.
      She does so by looking at the lines connecting the existing plants with a symbol around the mouse cursor indicating companion or antagonist.
  - The user positions the plant element in the appropriate location in the map.
  - When drawing an area of plants, the size of the area and the number of plants is shown next to the mouse.
  - The user is able to move, edit (e.g. when planted, when harvested), remove (that it was removed from the garden) and delete (that it never existed) selected plants.
  - The user adjusts the plant elements and their relationships as needed.
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  - The user attempts to add, move or edit a plant element but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
  - There is an error in the app's plant relationship indication and the lines connecting the plants are not displayed correctly. In this case, the app displays an error message.
- **Postcondition:**
  - The user's map includes the added, edited, moved, removed or deleted plant element as desired.
  - If constraints are violated for the place where a plant was added or moved, warnings get added (or removed) to (from) the [warnings layer](../assigned/warnings_layer.md).
- **Non-functional Constraints:**
  - Partial offline availability: editing attributes, especially for planting and harvesting
  - Supports alternatives
  - Performance: more than 10000 elements per year and per alternative should be usable without noticeable delays and acceptable memory overhead
  - Annual plants automatically get removed after one year.

## Development Progress

- The user is presented with a list of seasonal plants.  
  Currently only seasonal seeds are shown.  
  The expiration date is NOT considered.  
  The backend part is implemented [here](https://github.com/ElektraInitiative/PermaplanT/blob/9927a132de09377baad47237f3048939f84c568b/backend/src/controller/planting_suggestions.rs).  
  The list is then shown in [this component](https://github.com/ElektraInitiative/PermaplanT/blob/9927a132de09377baad47237f3048939f84c568b/frontend/src/features/map_planning/layers/plant/components/PlantSuggestionList.tsx)
- Planting relationships are shown.  
  The backend part is implemented [here](https://github.com/ElektraInitiative/PermaplanT/blob/9927a132de09377baad47237f3048939f84c568b/backend/src/controller/plant_layer.rs).  
  The overlay is displayed from [this component](https://github.com/ElektraInitiative/PermaplanT/blob/9927a132de09377baad47237f3048939f84c568b/frontend/src/features/map_planning/layers/plant/components/PlantLayerRelationsOverlay.tsx)
- The heatmap is actively worked on.
- The user can NOT adjust planting relationships.
- Planting as an area is NOT implemented.
- The warnings layer is NOT implemented.
- Offline availability is NOT implemented.
- Annual plants are NOT automatically removed after one year.
