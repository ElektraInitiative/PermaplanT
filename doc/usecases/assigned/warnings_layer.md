# Use Case: Warnings Layer

## Summary

- **Scope:** Warnings Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move and hides warnings.
- **Assignee:** Samuel

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the warnings layer.
- **Main success scenario:**
  - Warnings can be individual elements or connecting two elements (e.g. antagonists).
  - The user successfully adds, edits, moves and hides warnings.
- **Alternative scenario:**
  The user accidentally adds, edits, moves or hides the wrong warnings and uses the app's undo function to correct the mistake.
- **Error scenario:**
- **Postcondition:**
  The user's map shows the warnings as desired, or hides all of them if the layer has visibility off.
- **Non-functional Constraints:**
  - Performance: more than 10000 elements per year and per alternative should be usable without noticeable delays and acceptable memory overhead
- **Note:**
  - it gets dynamically generated based on alternatives
  - while doing drag and drop of [plants](../done/plants_layer.md), warnings are shown anyway.
