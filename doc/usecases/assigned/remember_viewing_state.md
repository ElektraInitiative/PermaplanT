# Use Case: Remember Viewing State

## Summary

- **Scope:** Map
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The map's visibility settings are restored from the user's last session.
- **Status:** Lukas

## Scenarios

- **Precondition:**
  The user is logged in and has opened a map.
- **Main success scenario:**
  - The user selects layer _A_.  
    He zooms into the map.  
    He scrolls/drags the map's viewport.  
    He sets layer _B_ invisible.  
    He sets layer _C_ with transparency.  
    He turns off the grid display.  
    He hides the plant labels.  
    He closes the browser, opens it again and logs in.
    He opens the same map again which he edited in his previous session.  
    He finds all the changes and settings from the last session being restored:
    - layer _A_ selected
    - zoomed-in on the map
    - all plants visible on the map's viewport
    - layer _B_ invisible
    - layer _C_ has the same transparency
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
  - The user does visibility changes on a map in browser _A_.
    He logs in in another browser _B_.
    He opens the same map in browser _B_.
    All the visibility changes the user applied to the map in browser _A_, are restored in browser _B_.
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
