# Use Case: Suggest Plants

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user is provided with suggestions on which plants to use.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user has opened the app.
  - The plants layer is enabled.
  - Plant(s) or a position on the map are selected.
- **Main success scenario:**

  - A choice of plants that

    1. work well with already placed plants and
    2. fit the environmental conditions

    are presented to the user.

  - Within those suggestions the user can see what plants go well with each other.

- **Alternative scenario:**
  - No plant(s) or position are selected.
  - Polyculture groups that fit the environmental conditions are suggested.
- **Error scenario:**
  - In case of any technical errors the users is notified about these.
  - When there are no matches due to too many constraints the user is informed that she has to remove a plant and try again.
- **Postcondition:**
  - The user has a selection of fitting plants to add to her garden.
- **Non-functional Constraints:**
  - Performance
