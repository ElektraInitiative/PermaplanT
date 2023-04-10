# Use Case: Buy Seeds

## Summary

- **Scope:** Seed Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The users buys missing seeds for the planned plants.
- **Status:** Assigned
- **Assignee:** Thorben

## Scenarios

- **Precondition:**
  - [Already existing seeds are entered](entry_list_seeds.md)
  - [Plants are planted](layers/plants_layer.md)
  - The user has opened the seed buying feature in the app.
- **Main success scenario:**
  - The user gets a suggestion which seeds to buy based on planted seeds minus existing seeds.
  - The seeds are grouped by seeds that are not, partially or sufficiently stocked.
  - The user adjusts the amount for the already existing seeds if wanted.
  - After confirming the purchase, the bought seeds get added to the [seed database](entry_list_seeds.md).
- **Alternative scenario:**
- **Error scenario:**
  There is an error when the user attempts to purchase the seeds.
  In this case, the [seed database](entry_list_seeds.md) stays unmodified and the user gets notified about the error.
- **Postcondition:**
  The [seed database](entry_list_seeds.md) contains all seeds as visible in the [map](layers/plants_layer.md).
- **Non-functional Constraints:**
