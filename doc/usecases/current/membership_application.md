# Use Case: Membership Application

## Summary

- **Scope:** Membership
- **Level:** User Goal
- **Actors:** User (Membership Applicant), Administrator (Chairman)
- **Brief:** The user can apply for a membership (account)
- **Assignee:** Thorben (Frontend), Lukas (Keycloak Installation)

## Scenarios

- **Precondition:**
  The user has opened the app and is not logged in.
- **Main success scenario:**
  1. The user can click an register button which leads them to Keycloak to fill out:
     - username
     - first+last name
     - email address
  2. The user can look at public maps (read-only and without seeing addresses!)
  3. The user can visit a 3-step form to apply for membership, with:
     - user photo (for Nextcloud)
     - telephone number (optional)
     - website
     - organisation
     - experience (optional)
     - photo of map
     - location of map (not shown to public users)
     - bank account
     - which kind of membership:
       - paid subscription membership
       - unpaid membership the user can maintain via gathering a certain number of permacoins per year
  4. An admin:
     - removes the bank account data
     - assigns the "member" role in Keycloak
     - changes quota in Nextcloud
  5. The user gets a notification via email
- **Alternative scenario:**
- **Error scenario:**
- **Postcondition:**
  - The user can enjoy all of PermaplanT's features.
- **Non-functional Constraints:**
