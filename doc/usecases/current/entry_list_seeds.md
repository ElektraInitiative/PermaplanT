# Use Case: Entry and List of Seeds

## Summary

- **Scope:** Seed Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The users manage their seeds by adding, viewing, and deleting them in the app.
- **Assignee:** Moritz (login/users), Giancarlo ([seed overview](https://github.com/ElektraInitiative/PermaplanT/issues/210))

## Scenarios

- **Precondition:**
  The user has opened the seed management feature in the app.
- **Main success scenario:**
  - The user is able to add new seeds to their list.
  - The user is able to view a list of seeds where plant name, additional name, harvest year, and amount is visible.
  - The user is able to edit or delete seeds of their list.
- **Alternative scenario:**
  The user accidentally deletes a seed from their list and uses the undo feature to correct it.
- **Error scenario:**
  There is an error when the user attempts to add a seed to their list, such as an invalid expiration date or a seed with the same name already existing.
  In this case, the app validates while the user is typing and shows a validation error.
- **Postcondition:**
  The user's seed list is updated with the added, deleted, or restored seeds.
- **Non-functional Constraints:**
