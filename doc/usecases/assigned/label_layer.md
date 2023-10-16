# Use Case: Labels Layer

## Summary

- **Scope:** Labels Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user adds labels to their map to identify different elements or areas
- **Assignee:** Daniel

## Scenarios

- **Precondition:**
  The user has opened the app and selected the labels layer.
- **Main success scenario:**
  The users successfully add labels to their map by selecting the element or area they want to label and entering the desired text in the label field.
  The label is displayed on the map and can be edited or removed at any time.
- **Alternative scenario:**
  The user accidentally adds a label in the wrong location and uses the app's undo function to correct the mistake
- **Error scenario:**
  The user tries to add a label with more than 2000 characters and the app prevents it by stopping any further insertions into the label field.
- **Postcondition:**
  The user's map includes labels as desired.
- **Non-functional Constraints:**
  - Offline availability
  - New Layers can be created.
  - Performance: more than 1000 elements per year and per layer should be usable without noticeable delays and acceptable memory overhead
