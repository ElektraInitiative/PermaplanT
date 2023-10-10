# Use Case: Copy & Paste Between Users

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can copy and paste a selection of elements, including succeeding crops, between his own map and a map of another user.
- **Status:** Analysis
- **Assignee:** Draft

## Scenarios

- **Precondition:**
  User A has opened the app on a key-controlled device and has made a selection of elements on one of his maps that he wants to copy and paste into the map of another user B.
- **Main success scenario:**
  - User A copies the selection on his map.  
    User A opens a map of user B.  
    User A clicks anywhere on that map of user B.  
    User A pastes the copied selection into user B's map.  
    The pasted selection of elements is placed in user B's map at the position where user A's last click happened.
- **Alternative scenarios:**
  - Same as for [Copy & Paste of Selection Within the Same Map](../current/copy_paste_within_same_map.md#scenarios), just with maps of two different users
  - The user logs in.  
    The user fails to paste the elements he copied in his previous session because they are removed from the 'copy-storage'.
- **Error scenarios:**
  - The user attempts to copy and paste a selection but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postconditions:**
  - The user's map contains the copied and pasted selection of elements.
  - User A's map still contains the same elements as before the copying and pasting into user B's map.
  - User B's map contains the pasted selection of elements which user A copied from one of his own maps.
- **Non-functional Constraints:**
  - Same as for [Copy & Paste of Selection Within the Same Map](../current/copy_paste_within_same_map.md#scenarios)
  - For performance reasons and to minimize potential sources of error, the copied selection of elements should be persisted locally on the client side, i.e. in the browser's local storage.
  - The new storage, i.e. the local storage, should be used for every _Copy & Paste_ scenario to store and retrieve the latest copied elements.
  - To avoid inconsistencies of all sorts, the new storage with the copied elements in it, should not be persisted beyond a user's session, i.e. it should cleared upon the user's next login.
- **Linked Use Cases:**
  - [Copy & Paste of Selection Within the Same Map](../current/copy_paste_within_same_map.md)
