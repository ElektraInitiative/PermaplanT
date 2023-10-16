# Use Case: Add Plant Relationships

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** A new plant relationship is added to the system.

## Scenarios

- **Precondition:**
  - The user has opened the UI to propose a new relationship.
- **Main success scenario:**
  - Details about the relationship are provided by the user.
    - The two sides of the relationship can be
      - Specific plants
      - Taxonomic ranks which are not specific plants
    - The type of the relationship can be
      - Companion
      - Antagonist
      - Neutral
    - Notes providing information on the why's and how's.
- **Alternative scenario:**
  - The user creates a relationship which is only effective for one or more of her selected maps.  
    In this case there is no review process.
    Map-specific relationships take precedence.
- **Error scenario:**
  - The user tries to add a global relationship where another global with identical sides already exits.  
    The user is informed about this and can't create the relationship.
  - The user tries to add a map-specific relationship where another map-specific with identical sides already exits.  
    The user is informed about this and can't create the relationship.
- **Postcondition:**
  - A new relationship between plants is [reviewable by other users](../assigned/review_plant_relationships.md).
  - A new relationship between plants is considered when suggesting alternatives.
- **Non-functional Constraints:**
