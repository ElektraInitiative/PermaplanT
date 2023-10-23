# Use Case: Nextcloud Circles

## Summary

- **Scope:** Nextcloud integrations
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can communicate with members of shared maps.
- **Assignee:** Samuel

## Scenarios

- **Precondition:**
  The user has opened the app and navigated to a map where they are a member of.
- **Main success scenario:**
  The user can open the chat window and communicate with all the members of the map.
- **Alternative scenario:**
  - The user has opened a map where they are not a member of.
    They are able to interact with the chat only if visitors are allowed.
- **Error scenario:**
- **Postcondition:**
  The conversations are persisted in Nextcloud.
  For each map there is a corresponding circle created in Nextcloud.
  The chats of the maps are visible under circles in Nextcloud.
- **Non-functional Constraints:**
