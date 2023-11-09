# Use Case: Multi-Select

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user changes properties or deletes multi-selected plants.
- **Assignee:** Christoph N.

## Scenarios

- **Precondition:**
  The user has made a selection of at least two plants.
- **Main success scenario:**
  - The user sets the _Added on_ date.  
    Then he sets the _Removed on_ date.
  - The user clicks on the deletion button and sees all selected plants disappear from the map.
- **Alternative scenario:**
  - The user accidentally deletes the selected plants and uses the app's undo function to correct the mistake.
  - The user accidentally sets a wrong date and uses the app's undo function to correct the mistake.
- **Error scenario:**
  The app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  - The _Added on_ date of all selected plants are changed.
  - The _Removed on_ date of all selected plants are changed.
  - All deleted plants are gone from the map as if they never existed.
- **Non-functional Constraints:**
  - The user should be able to undo/redo setting the _Added on_ and _Removed On_ date of all selected plants.
  - The user should be able to undo/redo the deletion of all selected plants.

## Development Progress

- Change logic of selecting plants so that, instead of a single plant, all the selected plants are recognized by the map store.
- The _Edit Plant Attributes_ section shouldn't show details of a single plant anymore when several plants are selected.
- Exclusively for the multi-selection scenario, the _Edit Plant Attributes_ section has to be re-designed from scratch, with following data required (in visual order from top to bottom):
  - An appropriate headline which points out that multiple plants are selected.
  - The _Added on_ and _Removed on_ date input fields with small explanations each.
  - The button to delete all selected plants.
- Implementation for the various 'for all selected plants at once'-functionalities:
  - Change _Added on_ date.
  - Change _Removed on_ date.
  - Delete them.
  - Render common dates, and only those, in the respective date input fields.
