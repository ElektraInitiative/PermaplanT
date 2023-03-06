# Use Case: Event Notification

## Summary

- **Scope:** Notifications
- **Level:** User Goal
- **Actors:** 
  - App User that hosts the event: "host"
  - App User that is nearby the host: "nearby user"
  - App User that has no location: "user without location"
- **Brief:** The user gets a notfication when another user has an event.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - Both users have opened the app and are logged in.
  - The host and the nearby user are located nearby (requires location settings of both users, nearby is a defined radius).
- **Main success scenario:**
  - The host announces an event (e.g. a "virtual welcome party" because planning of the map was finished)
  - Nearby user gets a notification which informs them about the event (e.g. invitation to visit the map virtually).
  - The user without location gets a notification which informs them about the event (e.g. invitation to visit the map virtually) 
  with the additional text that they get the invitation because they don't have a location set.
- **Alternative scenario:**
- **Error scenario:**
  The host does not have a location set: An error message is displayed,
  which informs them that the location is required for sending invitations.
- **Postcondition:**
- **Non-functional Constraints:**
