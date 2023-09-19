# Use Case: Copy & Paste of Selection Within the Same Map via CTRL-C & CTRL-V

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can copy and paste a selection of elements, including succeeding crops, within one map
- **Status:** Analysis
- **Assignee:** Christoph N.

## Scenarios

- **Precondition:**
  The user has opened the app on a key-controlled device and has made a selection of elements that he wants to copy and paste.
- **Main success scenario:**
  The user copies the selection by pressing CTRL-C.
  He clicks anywhere on the same map and pastes the copied selection into that map by pressing CTRL-V.
  The pasted selection of elements is placed at the user's last click position right before pasting.
- **Alternative scenario:**
  - The user pastes a copied selection without having clicked anywhere else on the map after copying.
    The pasted selection is placed with a horizontal and vertical offset next to the copied selection.
  - The user pastes a copied selection twice or more times in a row.
    The pasted selections are each placed with a horizontal and vertical offset next to each other.
  - The user pastes a copied selection while having any other element(s) currently selected.
    The pasted selection is placed with a horizontal and vertical offset next to the currently selected element(s).
  - The user pastes a copied selection having the base layer selected.
    No pasting happens.
    He selects another layer and successfully pastes that selection of elements into it.
  - The user copies and pastes a wrongly chosen selection of elements.
    He uses the app's undo function to revert the pasting.
- **Error scenario:**
  - The user attempts to copy and paste a selection but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
  - The user attempts to copy an amount of elements which exceeds a set max limit.
    The app informs the user that he tried to copy too many elements at once.
- **Postcondition:**
  The user's map includes the copied and pasted selection of elements.
- **Non-functional Constraints:**
  - Alternatives (selected elements depend on which alternative layer is selected)
  - The user should be able to undo/redo the pasting of a copied selection of elements.
  - After pasting, any current selection should be unselected, i.e. the transformer, shown around selected elements, will be removed.
  - A freshly pasted selection of elements should not be automatically selected.
  - Any copy & pasted element should have its own identity in the map, i.e. it's a unique Konva node on the current canvas.
  - For performance reasons and to prevent a bad user experience, the amount of elements a user can copy should be limited to an empirically examined and validated number.
- **Linked Use Cases:**
  - [Copy & Paste of Selection Between a User's Own Maps](../draft/copy_paste_between_own_maps.md)
  - [Copy & Paste of Selection Between Maps of Different Users](../draft/copy_paste_between_users.md)
  - [Copy & Paste of Selection via Context Menu](../draft/copy_paste_via_context_menu.md)
  - [Copy & Paste of Selection via Icons](../draft/copy_paste_via_icons.md)
