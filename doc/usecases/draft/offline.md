# Use Case: Offline

## Summary

- **Scope:** Notifications
- **Level:** User Goal
- **Actors:**
  - User: A user who wants to work offline.
    Must have the permissions to lock.
  - Other user: Other users who have write access to the same layers in the map
  - Owner of the map.
- **Brief:** The user has some features offline while being in the garden without Internet access.

## Scenarios

- **Precondition:**
  - The user has opened the app and is logged in.
- **Main success scenario:**
  - The user presses an "offline" button. (1)
  - Then the browser actually can be taken offline. (2)
  - The user goes to the garden.
  - The map can be edited on the layers that are marked suitable for offline functionality.
  - The user comes back from the garden.
  - After the work, the browser gets online. (3)
  - The user presses the "offline" button again. (4)
- **Alternative scenario:**
  - After a 8h timeout or if the owner of the map decides, the lock can be removed.
    In this case, all data from the offline work is lost.
- **Error scenario:**
  Could not go offline or online: An error message is displayed.
- **Postcondition:**
  - All changes while being online are transferred.
- **Non-functional Constraints:**
  It is clearly visible in which state the browser is:
  1. before going offline (browser is online)
  2. offline
  3. prepared for going online again (browser is online)
  4. online
