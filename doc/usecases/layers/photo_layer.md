# Use Case: Photo Layer

## Summary

- **Scope:** Photo Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can add, move and delete pictures in a map in the photo layer.
- **Status:** Draft

## Scenarios

- **Precondition:**
  The user has opened the app and has navigated to a map.
- **Main success scenario:**
  - The user successfully adds, moves and deletes pictures in a map using the photo layer.
  - When adding a picture the user can choose to upload one or choose from a preselection (emoticons, icons, etc..).
  - When the user clicks on a picture a chat shows up where the photo can be discussed.
- **Alternative scenario:**
- **Error scenario:**
  - When the user tries to delete a picture which they didn't create an error message is displayed
  - When the user tries to move a picture which they didn't create an error message is displayed
- **Postcondition:**
  - The pictures and chats are synchronized with Nextcloud.
- **Non-functional Constraints:**
- **Linked Use Cases:**
  - [Map Webcam](./map_webcam.md)
