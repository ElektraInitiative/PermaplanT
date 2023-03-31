# Use Case: Diversity Score

## Summary

- **Scope:** Diversity Score
- **Level:** User Goal
- **Actors:** App User
- **Brief:** A users map gets a permaculure score depending on his usage of diversity and polyculture.
- **Status:** Assigned
- **Assignee** Thorben

## Scenarios

- **Precondition:**
  - The user has opened the app and is editing a map.
- **Main success scenario:**
  - The user drags and drops various plants onto his map.
  - The system calculates a diversity score after each plant operation based on how diverse the map is.
  - A lot of different plants beneficial to the ecosystem (e.g. providing food and shelter for wild life), using plant companions and having high positive plant relations increases the score, 
    while overusing a small set of plants (in relation to size of map) negatively affects the scoring.
  - The user will be motivated to increase the diversity score and therefore optimizes the diversity and usage of polycultures on the map.
- **Alternative scenario:**
- **Error scenario:**
  - The app incorrectly calculates the diversity score.
    In this case the app will re-calculate the score after the next operation the user makes while the score is visible.
- **Postcondition:**
  - The user finds the diversity score in the map overview and the map planner.
  - The diversity score affects the order of the results in the [map search](map_search.md).
- **Non-functional Constraints:**-
  - Performance
