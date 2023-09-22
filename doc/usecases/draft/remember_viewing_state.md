# Use Case: Remember Viewing State of Map

## Summary

- **Scope:** Map
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user logs in, opens a map and all the map's visibility settings (zoom, viewport, layer selection, layer visibilities, grid, plant labels) are restored from his last session.
- **Status:** Draft

## Scenarios

- **Precondition:**
  The user is logged in and has opened a map.
- **Main success scenario:**
  - The user switches to the plants layer.  
    He zooms into the map.  
    He scrolls/drags the map's viewport until all his plants become visible again.  
    He sets the base layer invisible.  
    He turns off the grid display.  
    He hides the plant labels.  
    He logs out and, at some point later, logs in again.
    He opens that same map again which he edited in his previous session.  
    He finds all the changes and settings from the last session being restored:
    - plants layer selected
    - zoomed-in on the map
    - all plants visible on the map's viewport
    - base layer invisible
    - grid display turned off
    - plant labels hidden
- **Alternative scenario:**
  - The user does visibility changes on a map.  
    He navigates to the seeds page.  
    He uses browser-back to get back to the map.  
    All the visibility changes the user applied before, are restored.
  - The user does visibility changes on map _A_.  
    He opens another map _B_ and changes some visibility settings there too.  
    He goes back to map _A_ and finds all the visibility changes he did on map _A_, still being applied.  
    He goes back to map _B_ and sees that all the visibility settings he changed on map _B_, are still being set.
- **Error scenario:**
  The app is experiencing technical difficulties and unable to restore one or more of the map's visibility settings, displaying an info message that the map's viewing state could not be fully restored.
- **Postcondition:**
  - The map is shown with the same visibility settings it had when the user left it the last time, which includes:
    - zoom
    - map's (x,y)-offset in the viewport
    - selected layer
    - all layers' visibility
    - grid display
    - plant labels display
- **Non-functional Constraints:**
  - Changes to maps while being in offline-mode, are not considered for restoring (for now).
  - _Zustand_'s [_persist middleware_](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) should be used to store a map's state in a storage of any kind - not only do we already use _Zustand_ as our global state management library, but it also supports de-/serialization of `Maps` and `Sets`.  
    _Persist_'s [_partialize_](https://docs.pmnd.rs/zustand/integrations/persisting-store-data#partialize) option should then be used to only store the 'restore-worthy' data of a map.
  - Copy & Paste related data should not be restored, to not only reduce complexity of the storing/restoring- as well as the undo/redo-process, but also to prevent out-of-sync scenarios where copied elements are already deprecated/removed/outdated in the system/database.
    Besides that, applications offering the recovery of Copy & Paste state in a new session are extremely rare and therefore something the user does not necessarily expect to get.
