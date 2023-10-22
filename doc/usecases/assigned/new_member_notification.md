# Use Case: New Member Notification

## Summary

- **Scope:** Notifications
- **Level:** User Goal
- **Actors:**
  - App User which is newly registered: "new user"
  - App User which existed beforehand: "existing user"
- **Brief:** The user gets a notification when a new user joined.
- **Assignee:** Samuel
- **Simplification:** Every user gets notified for every new member.

## Scenarios

- **Precondition:**
  - The new user is registered.
  - The new user is located nearby (requires location settings of both users, nearby is a defined radius).
- **Main success scenario:**
  The existing user gets a notification (email) which informs them about the new user.
- **Alternative scenario:**
  One or both of the users have no location information: The user doesn't receive a notification.
- **Error scenario:**
- **Postcondition:**
- **Non-functional Constraints:**
