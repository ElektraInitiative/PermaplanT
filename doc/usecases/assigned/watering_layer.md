# Use Case: Watering Layer

## Summary

- **Scope:** Watering Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can log watering events for parts of or the entire garden to track watering history and improve plant care.
- **Assignee:** Lukas

## Scenarios

- **Precondition:**
  - The user has opened the app and has selected the watering layer.
- **Main success scenario:**
  - The user brushes permanent infrastructure:
    - roofs etc. (watering needed despite of rain)
    - automatic irrigation (no watering needed there)
  - The user logs a watering event:
    - by selecting individual plants
    - by brushing over the map
    - for all parts of the map which are open-air (area can be defined by where roofs etc. are)
  - The app saves the watering event with the current date.
  - The watering history is visible to the user, providing an overview of past watering events.
- **Alternative scenario:**
  - The user accidentally adds, edits or moves an element and uses "undo" or "delete" functionality to correct the mistake.
- **Error scenario:**
  - The user attempts to log a watering event with invalid data (e.g., negative water amount).
- **Postconition:**
  - The watering history is updated, and the user can review the information to make informed decisions about watering plants in the future.
- **Non-functional Contstrains:**
  - The watering management feature should be easy to use and understand.
  - The feature should work offline, allowing users to log watering events without an internet connection and synchronize the data when the connection is reestablished.
