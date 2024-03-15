# Use Case: Relation Layer

## Summary

- **Scope:** Relation Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, edit, move and hides relations.
- **Assignee:** Daniel

## Scenarios

- **Precondition:**
  The user has opened the app and has selected the relations layer.
- **Main success scenario:**
  - Relations are individual elements or connect two elements, that are removed or added when adding, moving, removing, deleting or modifying elements on the map:
    - nearby companion or antagonist (+-)
    - temporal beneficial or destructive relation (+-)
    - shade mismatch (-)
    - hydrology mismatch (-)
    - plant is on unsuitable or beneficial zone (+-)
  - The user successfully adds, edits, moves and hides relations.
- **Alternative scenario:**
  The user accidentally adds, edits, moves or hides the wrong relations and uses the app's undo function to correct the mistake.
- **Error scenario:**
- **Postcondition:**
  The user's map shows the relations as desired, or hides all of them if the layer has visibility off.
- **Non-functional Constraints:**
  - Performance: more than 10000 elements per year and per alternative should be usable without noticeable delays and acceptable memory overhead
- **Note:**
  - it gets dynamically generated based on alternatives
  - while doing drag and drop of [plants](../done/plants_layer.md), relations are shown anyway.

## Development

- relations are generated and stored in backend
