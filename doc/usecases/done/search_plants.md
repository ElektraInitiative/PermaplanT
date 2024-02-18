# Use Case: Search Plants

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can search for plants.
- **Status:** In Progress
- **Assignee:** Moritz (Frontend), Gabriel (Backend)
- **Test Protocol:** doc/tests/protocols/plant_search.md

## Scenarios

- **Precondition:**
  - The user is logged in to the app.
  - The plants layer or seed entry dialog is shown.
- **Main success scenario:**
  - The user types something into the search text box.  
    This will search for partial matches of actual plants (not higher ranks) in:
    - Unique name
    - German common names
    - English common names
    - Attributes that describe the plant, especially `edible_uses`, so that people can search for `popcorn`.
  - The results are ranked by how well the type text matches with the plant name, e.g. the user wrote "fir", "fir" should be first hit
  - The plant name is rendered as described in [hierarchy description](../../database/hierarchy.md)
- **Alternative scenario:**
  - No match can be found for what the user was searching for.  
    A message will be displayed that nothing was found.
- **Error scenario:**
- **Postcondition:**
  - The user has found the plant or a similar one to add to her map.
- **Non-functional Constraints:**
  - Performance
  - If there is a possible match in the database, it should be included (regardless of language settings etc.)

# Out-of-scope

- The matched part of the text should be bold.
- Results then get extended by the whole hierarchy below, e.g., a search for `Tomato` should include all cultivars.
- We don't consider language for ranking so that the backend can be agnostic to language.

Further out-of-scope topics are documented in the closed issue #379.
