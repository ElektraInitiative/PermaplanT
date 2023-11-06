# Use Case: Copy & Paste Within the Same Map

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can copy and paste a selection of elements, including succeeding crops, within one map.
- **Status:** Analysis
- **Assignee:** Christoph N.

## Scenarios

- **Precondition:**
  The user has opened the app on a key-controlled device and, on one of his maps, made a selection of elements that he wants to copy and paste into that same map.
- **Main success scenario:**
  - The user copies the selection by pressing CTRL-C.  
    The user clicks anywhere on that same map.  
    The user pastes the copied selection into the map by pressing CTRL-V.  
    The pasted selection of elements is placed in the map at the user's last click position right before pasting.
- **Alternative scenarios:**
  - The user pastes a copied selection without having clicked anywhere else on the map after copying.  
    The pasted selection is placed with a horizontal and vertical offset next to the copied selection.
  - The user pastes a copied selection several times in a row.  
    The pasted selections are each placed with a horizontal and vertical offset next to each other.
  - The user pastes a copied selection while having other element(s) currently selected.  
    The pasted selection is placed with a horizontal and vertical offset next to the currently selected element(s).
  - The user pastes a copied selection having the wrong layer selected and a warning appears advising the correct layer.  
    The user selects the correct layer and successfully pastes that selection of elements into it.
  - The user presses CTRL-C without having anything selected.  
    The user presses CTRL-V and no pasting happens because no elements have been copied.
  - In a step #1, the user presses CTRL-C on a selection of elements.  
    In a step #2, The user unselects that selection by clicking anywhere else on the map.  
    The user presses CTRL-C without having anything selected.  
    The user presses CTRL-V.  
    The, in step #1, copied selection of elements is pasted into the map, placed where the user clicked in step #2 to unselect the copied elements.
  - The user pastes a wrongly chosen selection of elements.  
    The user uses the app's undo function to revert the pasting.
- **Error scenarios:**
  - The user attempts to copy and paste a selection but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postconditions:**
  - The user's map contains the copied and pasted selection of elements.
- **Non-functional Constraints:**
  - Alternatives (selected elements depend on which alternative layer is selected)
  - Any copy & pasted element should have its own UUID in the map, i.e. it's a unique Konva node on the current canvas.
  - Left-click, middle-click and right-click should be accepted for setting the target position of the next pasting.
  - The shortcuts for copying and pasting (CTRL-C and CTRL-V) should be stored in a central place where future keybindings will be added too.
- **Linked Use Cases:**
  - [Copy & Paste of Selection Between a User's Own Maps](../draft/copy_paste_between_own_maps.md)
  - [Copy & Paste of Selection Between Maps of Different Users](../draft/copy_paste_between_users.md)
  - [Copy & Paste of Selection via Icons](../draft/copy_paste_via_icons.md)

## Development Progress

1. (this usecase) [Copy & Paste of Selection Within the Same Map](../assigned/copy_paste_within_same_map.md)  
   This usecase should be done before any other _Copy & Paste_-related usecase.  
   It will contain the core logic of copying and pasting.
2. [Copy & Paste of Selection via Icons](../draft/copy_paste_via_icons.md)  
   It can reuse everything implemented in the first usecase one-to-one.  
   Additionally it will add the logically-isolated possibility to copy and paste via icons plus the 'visibility-toggling' of the copy- and paste-icons' design.
3. [Copy & Paste of Selection Between a User's Own Maps](../draft/copy_paste_between_own_maps.md) / [Copy & Paste of Selection Between Maps of Different Users](../draft/copy_paste_between_users.md)  
   Here, the storing of the copied elements will have to be moved from the app's map store to the client side, i.e. the browser's local storage.
