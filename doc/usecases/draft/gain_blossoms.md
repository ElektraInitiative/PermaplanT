# Use Case: Gain Blossoms

## Summary

- **Scope:** Gain Blossoms
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user is awarded with Blossoms for achieving certain milestones.

## Scenarios

- **Precondition:**
  - The user has opened the app and uses it.
- **Main success scenario:**
  - The user can see a list of incomplete milestones and their respective requirements. An user can reach a certain milestone by e.g.:
    - change layers (visibility etc.)
    - base layer: set base image
    - change the date.
    - planting their first plant.
    - using an element from a new layer for the first time.
    - uploading their first photo in the [photo layer](../assigned/photo_layer.md).
    - harvesting a plant for the first time.
    - opening their first map for collaboration.
    - collaborating on a map from another user for the first time.
  - Blossoms are grouped in different tracks by what goal they try to incentivize, e.g.:
    - Beginners Track: leading new users through the basic features of PermaplanT.
    - Seasonal Track: motivate users to completely plan out their map and keep it updated through the seasons.
    - Completionist Track: rewarding users for enriching their own data with the results of their harvest.
    - Expert Track: incentivize users to support the platform and its other users to gain a free membership.
  - Further ideas:
    - planting their first full group of companions.
    - planting their first recommended diversity plant.
    - submitting updated plant data.
    - updating their plant relations with data from the harvest for the first time.
    - reaching a specific [diversity score](../draft/diversity_score.md) goal.
    - gathering all ingredients for an ingredient list for the first time.
    - buying their first batch of seeds.
    - creating their first event.
    - honoring a map from another user for the first time.
    - posting their first comment on a map from another user.
    - writing their first review of a map from another user.
    - receiving their first honor from another user.
    - receiving their first review from another user.
    - having their first conversation with another user through [matchmaking](../draft/matchmaking.md).
    - adding their first new plant in the apps database.
    - adding their first new seed in the apps database.
  - Progress of the individual milestones is tracked independently and they can be accomplished in any order.
  - The user is being kept updated on their progress when pursuing actions to complete a milestone.
  - Upon completing a milestone, the user is informed of their achievement and is awarded the corresponding Blossom.
  - Some Blossoms reset after a year to engage the user to continue the work in following seasons.
- **Alternative scenario:**
- **Error scenario:**
  The user meets the criteria for a certain Blossom, but it will not be awarded due to an error in the app.
  The Blossom will be awarded the next time its criteria will be checked.
- **Postcondition:**
  The awarded Blossoms will be shown in the users profile with a number indicating the amount of times this blossom was earned in previous seasons.
- **Non-functional Constraints:**

## Development Progress

- Backend API call for adding a Blossom to a user is implemented in [backend/src/controller/blossoms.rs](https://github.com/ElektraInitiative/PermaplanT/blob/766df8f6974ff42cd44113d6ff2d387bae091df8/backend/src/controller/blossoms.rs).
- Current version does not reference pre-defined [Blossom entities](https://github.com/ElektraInitiative/PermaplanT/blob/766df8f6974ff42cd44113d6ff2d387bae091df8/backend/src/model/entity.rs#L923) as there is currently no way to add them.
- Frontend awards Blossoms currently only for completing the [Guided Tour](https://github.com/ElektraInitiative/PermaplanT/blob/766df8f6974ff42cd44113d6ff2d387bae091df8/frontend/src/features/map_planning/components/Map.tsx#L78).
