# Use Case: New Member Notification

## Summary

- **Scope:** Notifications
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user gets a notfication when a new user joined.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user has opened the app and is logged in.
  - A new user is registered.
  - The new user is located nearby (requires location settings of both users, nearby is a defined radius).
- **Main success scenario:**
  The user gets a notification which informs them about the new user.
- **Alternative scenario:**
  One or both of the users have no location information: The user doesn't receive a notification.
- **Error scenario:**
- **Postcondition:**
- **Non-functional Constraints:**
