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
     1. which kind of membership (directly on landing page)
     2. form 1
        - salutation (Anrede)
        - title (Titel) [optional]
        - billing address (Rechnungsadresse)
        - country (Land)
        - additional emails (E-Mails) [optional]
        - telephone number [optional]
        - website [optional]
        - organisation [optional]
        - permaculture experience [optional]
        - user photo (uploaded in Nextcloud)
     3. form 2
        - if billing address or someone else's address should be used
        - one or several photos of the site
        - location of map(s) (not shown to default-roles-permaplant users)
     4. form 3
        - owner (KontoinhaberIn)
        - IBAN
        - BIC
        - how did you get to know about PermaplanT [optional text]
        - username for who recruited (angeworben) [optional]
        - privacy
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
