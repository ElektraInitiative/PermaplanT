# Use Case: Gain Free Membership

## Summary

- **Scope:** Membership
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user receives a free membership through using the app.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user already has an existing membership OR
  - The user has currently no membership.
- **Main success scenario:**
  - The user can receive PermaplanT points through various activities in the app, like:
    - gaining [Blossoms](./gamification/gain_blossoms.md) in the Expert Track.
    - getting likes from other users on their reviews.
    - getting [approvals](./polyculture/review_plant_relationships.md) on their submitted [plant relationships](./polyculture/add_plant_relationships.md).
    - getting their comments on a map marked as helpful by the maps owner.
  - The user can see their exact count of PermaplanT points in their profile.
  - When reaching a certain milestone with the amount of gathered PermaplanT points, the user will be given the current year of membership for free.
  - PermaplanT points will be reset to zero at the end of the membership year.
- **Alternative scenario:**
  - The user does not gather enough PermaplanT points and has to pay the full price for this years membership.
- **Error scenario:**
  - Due to an internal server error, the user is charged with this years membership even though (s)he gathered enough points.
    In this case, the user can contact the PermaplanT team via official channels so that an administrator can investigate the eligibility of the user for a free membership.
- **Postcondition:**
  - The user can use the app for free if (s)he is a valuable member of the community.
- **Non-functional Constraints:**
  - The amount of gathered PermaplanT point in each year should be kept in the database for administrative purposes.
