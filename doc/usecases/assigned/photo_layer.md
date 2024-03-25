# Use Case: Photo Layer

## Summary

- **Scope:** Photo Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, move, remove and delete pictures in a map in the photo layer.
- **Assignee:** Daniel

## Scenarios

- **Precondition:**
  The user has opened the app and has navigated to a map.
- **Main success scenario:**
  - The user successfully adds, moves, removes and deletes elements in a map using the photo layer. The elements can be:
    - a photo taken directly with the app
    - a photo/picture uploaded from the local file storage
    - a photo/picture already uploaded in Nextcloud
    - a picture from a preselection (emoticons like thumbs up 👍, various smiles 😂, hearts 💞, icons...)
  - When the user clicks on a picture a chat shows up where the photo can be discussed and commented (e.g. with thumbs up 👍).
- **Alternative scenario:**
  - The user accidentally edits, moves or removes an element and uses undo to correct the mistake.
  - The user accidentally adds an element and deletes it with the "delete" or "undo" functionality.
- **Error scenario:**
  - When the user tries to move, remove or delete a picture, which they didn't add, an error message is displayed
- **Postcondition:**
  - The pictures and chats are synchronized with Nextcloud.
- **Non-functional Constraints:**
  - Elements automatically get removed after one year.
- **Linked Use Cases:**
  - Non-semantic
  - [Map Webcam](../draft/map_webcam.md)
