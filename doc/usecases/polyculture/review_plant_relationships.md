# Use Case: Review Plant Relationships

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User, App User
- **Brief:** The quality of a user created plant relationship is assessed by others.
- **Status:** Assigned
- **Assignee:** Benjamin

## Scenarios

- **Precondition:**
  - The user is logged into the app.
  - She is looking at a [plant relationship created by another user](add_plant_relationships.md).
- **Main success scenario:**
  - The user comments on the relationship to note something that seems relevant to her.
  - The user approves the relationship because she agrees with it.
- **Alternative scenario:**
  - The user only comments on the relationship but doesn't approve it.  
    No changes are made to the relationships confidence score.
- **Error scenario:**
- **Postcondition:**
  - The confidence score of the relationship is higher due to the approval.  
    Relationships with higher confidence score will have a higher weight when [suggesting plants](suggest_plants.md) or [suggesting alternatives](suggest_alternatives.md).
- **Non-functional Constraints:**
