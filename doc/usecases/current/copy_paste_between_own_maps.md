# Use Case: Copy & Paste Between Own Maps

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can copy and paste a selection of elements, including succeeding crops, between his own maps.
- **Assignee:** Andrei

## Scenarios

- **Precondition:**
  The user has opened the app on a key-controlled device and made a selection of elements on his own map _A_ that he wants to copy and paste into his own map _B_.
- **Main success scenario:**
  - The user copies the selection on map _A_.  
    The user opens map _B_.  
    The user clicks anywhere on map _B_.  
    The user pastes the copied selection into map _B_.  
    The pasted selection of elements is placed in map _B_ at the user's last click position right before pasting.
- **Alternative scenarios:**
  - Same as for [Copy & Paste of Selection Within the Same Map](../assigned/copy_paste_within_same_map.md#scenarios), just with two different maps of the same user
  - The user logs in.  
    The user fails to paste the elements he copied in his previous session because they are removed from the 'copy-storage'.
- **Error scenarios:**
  - The user attempts to copy and paste a selection but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postconditions:**
  - The user's map contains the copied and pasted selection of elements.
  - The user's map _A_ still contains the same elements as before the copying and pasting into map _B_.
  - The user's map _B_ contains the pasted selection of elements which he copied from his map _A_.
- **Non-functional Constraints:**
  - Same as for [Copy & Paste of Selection Within the Same Map](../assigned/copy_paste_within_same_map.md#scenarios)
  - For performance reasons and to minimize potential sources of error, the copied selection of elements should be persisted locally on the client side, i.e. in the browser's local storage.
  - The new storage, i.e. the local storage, should be used for every _Copy & Paste_ scenario to store and retrieve the latest copied elements.
  - To avoid inconsistencies of all sorts, the new storage with the copied elements in it, should not be persisted beyond a user's session, i.e. it should cleared upon the user's next login.
- **Linked Use Cases:**
  - [Copy & Paste of Selection Within the Same Map](../assigned/copy_paste_within_same_map.md)
