# Use Case: Search Plants

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can search for plants to add to her map and sort results by different criterion.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user is logged in to the app.
  - The plants layer is selected.
- **Main success scenario:**
  - The user types something into the search text box.  
    This will search for partial matches of names of specific plants or names of higher taxonomic levels.
  - The results can be sorted by the following criterion.
    - Companions of existing plants (default)
    - Environmental fit
    - Ecological value
- **Alternative scenario:**
- **Error scenario:**
  - No match can be found for what the user was searching for.  
    A message will be displayed that nothing was found.
- **Postcondition:**
  - The user has found the plant or a similar one to add to her map.
- **Non-functional Constraints:**
