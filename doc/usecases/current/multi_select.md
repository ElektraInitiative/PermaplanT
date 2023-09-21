# Use Case: Multi-Select Plants and Change Their Dates All at Once or Delete Them Altogether

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can multi-select plants in a map and set the same _Added on_ and/or _Removed on_ date for all of them at once, or delete them all altogether.
- **Status:** Analysis
- **Assignee:** Christoph N.

## Scenarios

- **Precondition:**
  The user has made a selection of at least two plants.
- **Main success scenario:**
  - The user sets the _Added on_ date.  
    Then he sets the _Removed on_ date.  
    He clicks anywhere else on the map to unselect everything.  
    He again selects those same plants whose date he just changed and sees that both dates are prefilled with the dates he set.
- **Alternative scenario:**
  - The user clicks on the deletion button and sees all selected plants disappear from the map.
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

- The logic of selecting plants has to be changed in a way that, instead of a single plant, all the plants selected are recognized by the map store.
- It has to be made sure that no details of any plant are shown in the _Edit Plant Attributes_ section, when more than one plant is selected.
- Exclusively for the multi-selection scenario, the _Edit Plant Attributes_ section has to be re-designed from scratch, with following data required (in visual order from top to bottom):
  - An appropriate headline which points out that multiple plants are selected.
  - A short description of what can be done in this section:
    - Changing dates for all the selected plants at once.
    - Deleting all selected plants.
    - An info that common dates of the selected plants will be displayed, i.e. if all plants have the same _Added on_ or _Removed on_ date, that date will be shown inside the respective date input fields.
    - The _Added on_ and _Removed on_ date input fields with small explanations each.
    - The button to delete all selected plants.
- Implementation for the various 'for all selected plants at once'-functionalities:
  - Change _Added on_ date.
  - Change _Removed on_ date.
  - Delete them.
  - Render common dates, and only those, in the respective date input fields.
