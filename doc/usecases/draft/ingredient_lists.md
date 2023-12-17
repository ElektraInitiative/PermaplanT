# Use Case: Ingredient Lists

## Summary

- **Scope:** Ingredient Lists
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can create lists to keep track of ingredients needed over the year.

## Scenarios

- **Precondition:**
  - The user has opened the app and is editing a map.
- **Main success scenario:**
  - The user has a list of fruits and vegetables that are needed continuously over the course of a timespan, e.g. a daily smoothie or salad.
  - The user inputs the items into a form in the map editor and can set a name and picture for the ingredient list.
  - The user is able to have multiple of those ingredient lists.
  - The lists will display what ingredients are available on the map and which still need to be planted by the user.
  - While harvesting or after harvesting (if the user has conserved some of it, e.g., stored fresh fruits, dried herbs), (s)he can mark ingredients as available over a specific timespan and unmark it once the harvest is over or storage is exhausted.
  - The user is awarded a Blossom for having all necessary ingredients for any list in any month and additional ones for every subsequent month the list requirements are completely met.
- **Alternative scenario:**
- **Error scenario:**
  The app does not mark a list item as (partially) harvested even though the user marked the relevant plant as harvested.
  In this case, the user should try again to mark the plant as harvested to re-initialize the ingredient list check.
- **Postcondition:**
  The user can keep track of needed ingredients and gets an overview of plants to plant on the map.
- **Non-functional Constraints:**
