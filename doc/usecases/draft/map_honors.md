# Use Case: Map Honors

## Summary

- **Scope:** Map Honors
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The users can give an honor to the whole map of another user they visit.

## Scenarios

- **Precondition:**
  - The user has opened the app.
  - The user is currently viewing the map of another user.
- **Main success scenario:**
  - The user wants to show appreciation for the entirety of the currently visited map.
  - The user uses the honor button to give an honor directly to the entire map.
  - The amount of honors for that specific map increases.
- **Alternative scenario:**
  - The user uses the honor button to withdraw a previously given honor on the currently visited map.
  - The amount of honors for that specific map decreases.
- **Error scenario:**
  A network error occurs, preventing the app from updating the honor count of the given map.
  In this case, a warning message stating the error should be displayed and the user is prompted to try again.
- **Postcondition:**
  Users can find the honor count next to the map in every instance of map selection as well as in the details screen of the map.
  The amount of honors affects the order of the results in the [map search](../assigned/map_search.md).
- **Non-functional Constraints:**
