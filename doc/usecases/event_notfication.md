# Use Case: Event Notification

## Summary

- **Scope:** Notifications
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user gets a notfication when another user has an event.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user has opened the app and is logged in.
  - A user triggers an event (e.g. has finished planning their map)
  - The users are located nearby (requires location settings of both users, nearby is a defined radius).
- **Main success scenario:**
  Nearby users gets a notification which informs them about the event (e.g. invitation to visit the map virtually).
- **Alternative scenario:**
  One or both of the users have no location information: The user doesn't receive a notification.
- **Error scenario:**
- **Postcondition:**
- **Non-functional Constraints:**
