# Use Case: Review Plant Relationships

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** Reviewing User, Reviewed User, Administrator
- **Brief:** The quality of a user-created plant relationship is assessed by others.

## Scenarios

- **Precondition:**
  - The reviewing user is logged into the app.
  - She is looking at a [plant relationship created by another user](add_plant_relationships.md), the reviewed user.
- **Main success scenario:**
  - The reviewing user comments on the relationship to note something that seems relevant to her.
  - The reviewing user approves the relationship because she agrees with it.
- **Alternative scenario:**
  - The reviewing user only comments on the relationship but doesn't approve it and might suggest a different relationship (e.g. neutral).
  - No changes are made to the relationships confidence score.
  - One administrator decides on the outcome.
- **Error scenario:**
- **Postcondition:**
  - The number of approvals are counted for the administrator to decide on the confidence score.
    Relationships with higher confidence score will have a higher weight when suggesting plants or suggesting alternatives.
  - On changes of the confidence score, the reviewed user gets notified about the updated score.
- **Non-functional Constraints:**
