# Use Case: Search Plants

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can search for plants to add to her map and sort results by different criterion.
- **Status:** In Progress
- **Assignee:** Moritz, Paul

## Scenarios

- **Precondition:**
  - The user is logged in to the app.
  - The plants layer or seed entry dialog is shown.
- **Main success scenario:**
  - The user types something into the search text box.  
    This will search for partial matches of:
    - names of specific plants (specie or variety)
    - Binomial name (Latin name)
    - German and English common names
    - German and English synonyms
    - Furthermore, other columns can be matched with extra syntax
  - The results are ranked by:
    1. Environmental fit (from selected plant or position)
    2. Ecological value
- **Alternative scenario:**
- **Error scenario:**
  - No match can be found for what the user was searching for.  
    A message will be displayed that nothing was found.
- **Postcondition:**
  - The user has found the plant or a similar one to add to her map.
- **Non-functional Constraints:**
  - Performance
  - Search accuracy (stop words, stemming, etc.)
