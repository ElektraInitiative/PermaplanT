# Use Case: Map Collaboration

## Summary

- **Scope:** Map Collaboration
- **Level:** User Goal
- **Actors:** App User
- **Brief:** Users can plan on the map of another user.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - A user has created a map and at least on other user is registered in Nextcloud.
- **Main success scenario:**
  - The map creator is able to open the map for collaboration and picks a set of constraints for the collaborators 
    (e.g. editing only a part of the map or only specific layers).
  - The user can choose if the map is open to edit for everyone or only through directly assigned permissions, 
    in which case users can be searched by their name and get sent an invitation to collaboration.
  - [Alternative versions](layers_alternatives.md) of the relevant layers will be created by the app. 
    Other users collaborating to this map can only affect these layers.
  - Additionaly, the map creator can leave a comment with additional information for other users on what the finished map should contain, 
    like e.g. only to use a list of specific plants.
  - Another user, optionally with direct permission if specified, can enter the map like it is one of their own and use 
    the design functions under the given constraints.
- **Alternative scenario:**
- **Error scenario:**
  The app can't send an invitation to a requested user through network issues.
  In this case, the user should be informed by an error message and is prompted to try again.
- **Postcondition:**
  A user gets help designing their map by other users of PermaplanT.
- **Non-functional Constraints:**
