# Use Case: Reward Preview

## Summary

- **Scope:** Reward Preview
- **Level:** User Goal
- **Actors:** App User
- **Brief:** A user can see a preview of future rewards for his efforts.
- **Assignee** Ready to be assigned

## Scenarios

- **Precondition:**
  - The user has opened the app and is editing a map.
  - The user has planted at least one plant on his map.
- **Main success scenario:**
  - When viewing the map on such a date, the plants with an active blooming or harvesting period at that time will be marked on the map.
- **Alternative scenario:**
  - Optionally, this can be disabled in the users' preferences.
- **Error scenario:**
  The app incorrectly displays a plant as having an active blooming or harvesting period or does not display it for a plant that should have one.
  In this case the user should reload the layer to let the system recalculate the conditions for displaying active blooming or harvesting periods.
- **Postcondition:**
  The user always sees what personal benefits he gets from the plants on the map.
- **Non-functional Constraints:**
