
# Use Case: Watering Management

## Summary

- **Scope:** Watering Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can log watering events for individual plants or the entire garden, including rainwater, to track watering history and improve plant care.
- **Status:** Draft
- **Assignee:** Ramzan

## Scenarios

- **Precondition:**
 - The user has opened the app and has selected the watering layer.
- **Main success scenario:**
 - The user logs a watering event for an individual plant or a specific garden area.
 - The user can also log a "water everywhere" event, indicating that rainwater has been applied to the entire garden.
 - The app saves the watering event, including the date and time.
 - The watering history is visible to the user, providing an overview of past watering events.
- **Alternative scenario:**
 - The user edits or deletes a previously logged watering event.
- **Error scenario:**
 - The user attempts to log a watering event with invalid data (e.g., future date, negative water amount). 
- **Postconition:**
 - The watering history is updated, and the user can review the information to make informed decisions about watering plants in the future.
- **Non-functional Contstrains:**
 - The watering management feature should be easy to use and understand.
 - The feature should work offline, allowing users to log watering events without an internet connection and synchronize the data when the connection is reestablished.
