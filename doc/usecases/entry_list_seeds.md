# Use Case: Entry and list of seeds

## Summary

- **Scope:** Seed Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can manage their seeds by adding, viewing, and deleting them in the app.
- **Status:** Draft

## Scenarios

- **Precondition:**
  The user has opened the seed management feature in the app.
- **Main success scenario:**
  The user is able to add new seeds to their list by specifying the name, amount, and expiration date. 
  They can also view and delete seeds from their list. 
  The app will also likely recommend using seeds that are about to expire.
- **Alternative scenario:**
  The user accidentally deletes a seed from their list and uses the seed entry to reinsert it.
- **Error scenario:**
  There is an error when the user attempts to add a seed to their list, such as an invalid expiration date or a seed with the same name already existing. 
  In this case, the app displays an error message to the user.
- **Postcondition:**
  The user's seed list is updated with the added, deleted, or restored seeds.
- **Non-functional Constraints:**
