# Use Case: Buy Seeds

## Summary

- **Scope:** Seed Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The users buys missing seeds for the planned plants.
- **Assignee:** Paul

## Scenarios

- **Precondition:**
  - [Already existing seeds are entered](../current/entry_list_seeds.md)
  - [Plants are planted](../done/plants_layer.md)
  - The user has opened the seed buying feature in the app.
- **Main success scenario:**
  - The user gets a suggestion which seeds to buy based on planted seeds minus existing seeds.
  - The seeds are grouped by seeds that are not, partially or sufficiently stocked.
  - The user adjusts the amount for the already existing seeds if wanted.
  - After confirming the purchase, the bought seeds get added to the [seed database](../current/entry_list_seeds.md).
- **Alternative scenario:**
- **Error scenario:**
  There is an error when the user attempts to purchase the seeds.
  In this case, the [seed database](../current/entry_list_seeds.md) stays unmodified and the user gets notified about the error.
- **Postcondition:**
  The [seed database](../current/entry_list_seeds.md) contains all seeds as visible in the [map](../done/plants_layer.md).
- **Non-functional Constraints:**
