# Use Case: Add Plant Relationships

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** A new plant relationship is added to the system.
- **Status:** Assigned
- **Assignee:** Benjamin

## Scenarios

- **Precondition:**
  - The user has the opened the UI to propose a new relationship.
- **Main success scenario:**
  - Details about the relationship are provided by the user.
     - The two sides of the relationship can be
       - Specific plants
       - Any higher taxonomic level (e.g. family, subfamily)
     - The type of the relationship can be
       - Companion
       - Antagonist
     - A description providing information on the whys and hows.
- **Alternative scenario:**
  - The user creates a relationship which is only effective for one or more of her selected maps.  
    In this case there is no review process.
- **Error scenario:**
  - A relationship with identical sides already exits.  
    The user is informed about this and can't create the relationship.
- **Postcondition:**
  - A new relationship between plants is [reviewable by other users](review_relationship.md).
  - A new relationship between plants is considered when suggesting alternatives.
- **Non-functional Constraints:**
