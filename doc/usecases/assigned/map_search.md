# Use Case: Map Search

## Summary

- **Scope:** Map Search
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can search for maps within the app using keywords, including the ability to search for public maps created by other users.
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
  The user has opened the app and is on the map search page.
- **Main success scenario:**
  - A list of all maps are shown, including both the user's own maps and public/protected maps created by other users.
    For each map:
    - A small image either of the photo or of its content is shown
    - The name is shown
  - The user enters a keyword into the search field and the app filters the list of maps that match the keyword.
  - The user can then select a map to view it.
- **Alternative scenario:**
  The user enters a keyword that does not match any maps in the app.
  In this case, the app displays a message to the user indicating that no maps were found.
- **Error scenario:**
  There is an error in the app's search functionality and the maps are not correctly retrieved.
  In this case, the app displays an error message to the user and allows them to try again.
- **Postcondition:**
  The user has successfully searched for a map and retrieved correct results within the app.
- **Non-functional Constraints:**
  - The app's search functionality must be fast and efficient in order to provide a seamless user experience.
  - The app must clearly communicate to the user whether their search was successful or not.
