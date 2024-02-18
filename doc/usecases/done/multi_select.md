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

fully done
