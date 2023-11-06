# Use Case: Map Collaboration

## Summary

- **Scope:** Map Collaboration
- **Level:** User Goal
- **Actors:** Map Creator, Collaborator
- **Brief:** Collaborators plan on the map of a map creator.
- **Simplification:** Without alternatives.

## Scenarios

- **Precondition:**
  - A map creator has created a map and at least one other collaborator is registered.
- **Main success scenario:**
  - The map creator is able to open the map for collaboration.
  - The map creator chooses if the map is open to edit for every registered user or only through directly assigned permissions,
    in which case potential collaborators can be searched by their name and get an invitation to collaboration.
  - The map creator can create [alternatives](../draft//layers_alternatives.md) of existing layers and designate which can be edited by collaborators.
  - Additionally, the map creator can leave a comment with additional information for collaborators,
    like e.g. a list of specific plants the map should contain.
  - A collaborator, optionally with direct permission if specified, can enter the map like it is one of their own.
- **Alternative scenario:**
- **Error scenario:**
  The app can't send an invitation to a requested collaborator through network issues.
  In this case, the map creator should be informed by an error message and is prompted to try again.
- **Postcondition:**
  A map creator gets help designing their map by collaborators.
- **Non-functional Constraints:**
