# Use Case: Gain Blossoms

## Summary

- **Scope:** Gain Blossoms
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user is awarded with Blossoms for achieving certain milestones.
- **Status:** Assigned
- **Assignee** Thorben

## Scenarios

- **Precondition:**
  - The user has opened the app and uses it.
- **Main success scenario:**
  - The user can see a list of incompleted milestones and their respective requirements. An user can reach a certain milestone by e.g.:
    - starting their first map.
    - planting their first plant.
    - planting their first full group of companions.
    - planting their first recommended plant.
    - using an element from a new layer for the first time.
    - submitting updated plant data.
    - harvesting a plant for the first time.
    - becoming a member.
    - reaching a specific [diversity score](diversity_score.md) goal.
    - gathering all ingredients for an ingredient list for the first time.
    - uploading their first photo in the [photo layer](../layers/photo_layer.md).
    - buying their first batch of seeds.
    - creating their first event.
    - honoring a map from another user for the first time.
    - posting their first comment on a map from another user.
    - writing their first review of a map from another user.
    - receiving their first honor from another user.
    - receiving their first review from another user.
    - opening their first map for collaboration.
    - collaborating on a map from another user for the first time.
    - having their first conversation with another user through [matchmaking](../matchmaking.md).
    - adding their first new plant in the apps database.
    - adding their first new seed in the apps database.
  - Progress of the individual milestones is tracked independently and they can be accomplished in any order.
  - The user is being kept updated on their progress when pursuing actions to complete a milestone.
  - Upon completing a milestone, the user is informed of their achievement and is awarded the corresponding Blossom.
- **Alternative scenario:**
- **Error scenario:**
  The user meets the criteria for a certain Blossom, but it will not be awarded due to an error in the app.
  The Blossom will be awarded the next time its criteria will be checked.
- **Postcondition:**
  The awarded Blossoms will be shown in the users profile.
- **Non-functional Constraints:**
