# Use Case: Permaculture Score

## Summary

- **Scope:** Permaculture Score
- **Level:** User Goal
- **Actors:** App User
- **Brief:** A users map gets a permaculure score depending on his usage of diversity and polyculture.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user has opened the app and is editing a map.
- **Main success scenario:**
  - The user drags and drops various plants onto his map.
  - The system calculates a permaculture score after each plant operation based on how sustainable and diverse the map is.
  - A lot of diverse and rare plants, using plant companions and having high positive plant relations increases the score, 
    while overusing a small set of plants negatively affects the scoring.
  - The user will be motivated to increase the permaculture score and therefore optimizes the diversity and usage of polycultures on the map.
- **Alternative scenario:**
- **Error scenario:**
  - The app incorrectly calculates the permaculture score.
    In this case the app will re-calculate the score after the next operation the user makes.
- **Postcondition:**
  - The user finds the permaculture score in the map overview and the map planner.
  - The permaculture score affects the order of the results in the [map search](map_search.md).
- **Non-functional Constraints:**-
