# Use Case: Copy & Paste of Selection Via Icons

## Summary

- **Scope:** All Layers, except Base
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can copy and paste a selection of elements, including succeeding crops, by using the appropriate icons in the toolbar.
- **Status:** Analysis
- **Assignee:** Draft

## Scenarios

- **Precondition:**
  The user has opened the app and has made a selection of elements that he wants to copy and paste.
- **Main success scenario:**
  - The user copies the selection by clicking on the _copy_ icon in the toolbar.  
    He clicks anywhere on the map.  
    He pastes the copied selection into the map by clicking on the _paste_ icon in the toolbar.  
    The pasted selection of elements is placed at the user's last click position right before pasting.
- **Alternative scenario:**
  Same as for [Copy & Paste of Selection Within the Same Map](../current/copy_paste_within_same_map.md#scenarios), just with clicking the icons in the toolbar instead of using the keyboard shortcuts
- **Intercondition:**
  - The user sees the _copy_ icon as disabled and greyed out because he has no elements selected.
  - The user sees the _paste_ icon as disabled and greyed out because he has not copied any element(s) in his current session yet.
  - The user copies a selection of elements for the first time in his current session.  
    He sees the _paste_ icon getting enabled and not being greyed out anymore.
  - The user makes a selection of elements on the map, not having had anything selected right before.  
    He sees the _copy_ icon getting enabled and not being greyed out anymore.
- **Error scenario:**
  Same as for [Copy & Paste of Selection Within the Same Map](../current/copy_paste_within_same_map.md#scenarios)
- **Postcondition:**
  - Same as for [Copy & Paste of Selection Within the Same Map](../current/copy_paste_within_same_map.md#scenarios)
  - The _copy_ icon is disabled and greyed out because after pasting every selection is gone.
  - The _paste_ icon is enabled and not greyed out.
- **Non-functional Constraints:**
  - Same as for [Copy & Paste of Selection Within the Same Map](../current/copy_paste_within_same_map.md#scenarios)
  - The icons' Look and Feel should always signal their current state, i.e. if they are enabled or disabled.
- **Linked Use Cases:**
  - [Copy & Paste of Selection Within the Same Map](../current/copy_paste_within_same_map.md)
