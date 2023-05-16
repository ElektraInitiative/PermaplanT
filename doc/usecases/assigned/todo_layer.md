# Use Case: Todo Layer

## Summary

- **Scope:** Todo Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user adds todos to their map to remember what to do at certain locations
- **Assignee:** Samuel

## Scenarios

- **Precondition:**
  The user has opened the app and selected the todo layer.
- **Main success scenario:**
  The users successfully adds a task to their map with following content:
  - location on the map
  - title of card
  - description
  - end date
  - assigned person
    The task is displayed on the map and can be moved, edited, archived or removed at any time.
- **Alternative scenario:**
  - The user accidentally adds a task in the wrong location and uses the app's undo function to correct the mistake.
  - The user has no Board or List configured where cards should be added.
- **Error scenario:**
  The user tries to add a task with a title of than 255 characters and the app prevents it by stopping any further insertions into the task input field.
- **Postcondition:**
  The user's map includes tasks as desired.
  The tasks are synchronized to the Nextcloud Deck named after the PermaplanT map.
- **Non-functional Constraints:**
  - Offline availability
  - Performance: more than 1000 elements per year and per layer should be usable without noticeable delays and acceptable memory overhead
