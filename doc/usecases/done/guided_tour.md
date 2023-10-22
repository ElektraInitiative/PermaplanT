# Use Case: Guided Tour

## Summary

- **Scope:** Gamification
- **Level:** User Goal
- **Actors:** User
- **Brief:** The user is presented with an introduction tour upon first encountering the map editor.
- **Status:** Done
- **Assignee:** Thorben

## Scenarios

- **Precondition:**
  - The user is member and logged in.
  - The user has created a map.
  - The user has opened the map editor.
  - The user has not previously completed the guided tour.
- **Main success scenario:**
  The user is shown a guided tour, which explains the features of the map editor based on a small scenario.
  The user will have to place and remove plants, use the timeline, see plant relations and use the undo feature in this scenario.
  After completing the guided tour, the user is awarded a [Blossom](../draft/gain_blossoms.md).
- **Alternative scenario:**
  The user does not want to do the guided tour and can cancel it during any step.
  Upon cancel, the user decides to see it on their next visit or to cancel it indefinitely.
- **Error scenario:**
  A network problem prevents the frontend from checking if the guided tour was already completed and will show an error message.
- **Postcondition:**
  The guided tour is completed or canceled and won't be shown again next time.
- **Non-functional Constraints:**

## Development Progress

- Tour steps and display options are defined in their own [typescript file](https://github.com/ElektraInitiative/PermaplanT/blob/e4931dc6b4e1bbfaa48a6094a7c289f3cd2de57c/frontend/src/features/map_planning/utils/EditorTour.ts).
- CSS classes for the styling of the tour were added as a separate [CSS file](https://github.com/ElektraInitiative/PermaplanT/blob/e4931dc6b4e1bbfaa48a6094a7c289f3cd2de57c/frontend/src/styles/guidedTour.css).
- Guided tour is added to the application as part of the [map wrapper](https://github.com/ElektraInitiative/PermaplanT/blob/e4931dc6b4e1bbfaa48a6094a7c289f3cd2de57c/frontend/src/features/map_planning/routes/MapWrapper.tsx).
- The tour is started and event listeners are added in the [map component](https://github.com/ElektraInitiative/PermaplanT/blob/e4931dc6b4e1bbfaa48a6094a7c289f3cd2de57c/frontend/src/features/map_planning/components/Map.tsx).
- Follow-up Issue(s): [#710](https://github.com/ElektraInitiative/PermaplanT/issues/710).
