# Use Case: Map Collaboration

## Summary

- **Scope:** Map Collaboration
- **Level:** User Goal
- **Actors:** Map Creator, Collaborator
- **Brief:** Enable collaborators to modify a map.
- **Simplification:** Without alternatives.
- **Assignee:** Paul, Andrei

## Scenarios

- **Precondition:**
  - A map creator creates a map or has created a map.
  - At least one other collaborator is registered in Keycloak.
- **Main success scenario:**
  - The map creator chooses if the map is open to be viewed by every registered user or member (public/protected/private).
  - The map creator searches for collaborators by their name.
  - The map creator adds a collaborator found before (repeated as needed).
  - The map creator can create [alternatives](../draft//layers_alternatives.md) of existing layers and designate which can be edited by collaborators.
- **Alternative scenario:**
  - The map creator removes a previously added collaborator.
- **Error scenario:**
  The app can't send an invitation to a requested collaborator through network issues.
  In this case, the map creator should be informed by an error message and is prompted to try again.
- **Postcondition:**
  - Collaborators can modify the map like it is one of their own.
  - Collaborators cannot modify map properties.
- **Non-functional Constraints:**
  - 30 collaborators can be added on one map.
