# Use Case: Entry and List of Seeds

- **Scope:** Seed Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The users manage their seeds by adding, editing, searching, viewing and archiving them.
- **Assignee:** Moritz

## Scenarios

The user has opened the seed management feature in the app.

- **Main success scenario:**
  - The user is able to add new seeds to their list.
  - The user is able to search for seeds using the full plant name.
  - The user is able to view a list of seeds where the complete name, amount, quality, harvest year, and origin is visible.
  - The user is able to edit or archive seeds of the list.
  - The user is able to search for seeds with their complete name.
- **Alternative scenario:**
  The user accidentally archives a seed from their list and uses the undo feature to correct it.
- **Error scenario:**
  There is an error when the user attempts to add or edit a seed entry with invalid data such as an invalid price.
  In this case, the app validates when saving the seed and shows a validation error.
- **Postcondition:**
  The user's seed list corresponds exactly with the physical seeds in the user's seed box in reality.
