# Use Case: Suggest Plants

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user gets plant suggestions that she would not have thought of herself.
- **Assignee:** Lukas

## Scenarios

- **Precondition:**
  - The user has opened the app.
  - The plants layer is enabled.
  - Plant(s) or a position on the map are selected.
- **Main success scenario:**

  - A choice of plants that

    1. work well with already placed plants and
    2. fit the environmental conditions
    3. have a high ecological value

    are presented to the user.
    Further more, the plants should be grouped by:

    - available seeds with early expiration days first
    - favourites of users
    - and lastly which were recently planted

  - Within those suggestions the user can see what plants go well with each other.
  - The user can see why these plants have a high ecological value. e.g.:
    - Attracts wildlife
    - Attracts pollinating insects
    - Is a nitrogen fixer
    - Is a cover crop
    - Are less commonly planted
    - etc.

- **Alternative scenario:**
  - No plant(s) or position are selected.
  - Polyculture groups that fit the environmental conditions are suggested.
- **Error scenario:**
  - In case of any technical errors the users is notified about these.
  - When there are no matches due to too many constraints the user is informed that she has to remove a plant and try again.
- **Postcondition:**
  - The user can consider plants she would have never though of herself.
- **Non-functional Constraints:**
  - Performance
