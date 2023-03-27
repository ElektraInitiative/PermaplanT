# Use Case: Ingredient Lists

## Summary

- **Scope:** Ingredient Lists
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can create lists to keep track of ingredients needed over the year.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user has opened the app and is editing a map.
- **Main success scenario:**
  - The user has a list of fruits and vegetables that are either needed for a specific event or continuously over the course of a timespan, e.g. for a party or a daily smoothie.
  - The user inputs the items into a form in the map editor and can set a name and picture for the ingredient list.
  - The user is able to have multiple of those ingredient lists.
  - The lists will automatically track which fruits and vegetables have been harvested and update the still missing ingredients accordingly.
    If multiple lists require the same item, then the app will prioritize the oldest ingredient list.
- **Alternative scenario:**
- **Error scenario:**
  The app does not mark a list item as (partially) harvested even though the user marked the relevant plant as harvested.
  In this case, the user should try again to mark the plant as harvested to re-initialize the ingredient list check.
- **Postcondition:**
  The user can keep track of needed ingredients and gets an overview of plants to plant on the map.
- **Non-functional Constraints:**
