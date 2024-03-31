# Use Case: Calendar

## Summary

- **Scope:** Calendar
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user sees which of the planned plants are to be planted next. ("Saisonübersicht")
- **Assignee:** Samuel

## Scenarios

- **Precondition:**
  The user has opened the app and is on the calendar page.
- **Main success scenario:**
  - The user gets an overview when planned plants are to be raised or planted; and later to be harvested.
  - It is shown in bars, ordered by next steps to be done first.
  - The users move the bar according to their wishes to indicate raising or planting earlier/later.
  - The users can also precisely edit the raising/planting/harvesting date as wanted by clicking on the bar.
- **Alternative scenario:**
  - The user doesn't have any planned plants yet, the page stays empty.
    The users are informed that they need to plan plants first.
  - The bar was moved too early or too late, the users get a warning which they need to confirm.
    If not confirmed, the bar stays unmodified.
- **Error scenario:**
- **Postcondition:**
  - Calendar is synchronized to Nextcloud
- **Non-functional Constraints:**
  - Alternatives (dates depend on which alternative plants layer is selected)
