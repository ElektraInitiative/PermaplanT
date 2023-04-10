# Use Case: Search Plants

## Summary

- **Scope:** Plants Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can search for plants to add to her map and sort results by different criterion.
- **Status:** In Progress
- **Assignee:** Moritz, Paul

## Scenarios

- **Precondition:**
  - The user is logged in to the app.
  - The plants layer or seed entry dialog is shown.
- **Main success scenario:**
  - The user types something into the search text box.  
    This will search for partial matches of actual plants (not higher ranks) in:
    - Scientific name
    - German common names
    - English common names
    - Furthermore, other columns can be matched with extra syntax (e.g. environmental fit or ecological value)
  - The results are ranked by:
    1. Exact matches, without additional letters before or after, e.g. the user wrote "fir", "fir" should be first hit
    2. Language settings, e.g., when typing "fi" on English setting "fir" should rank higher than German "Fichte"
       (and the other way round)
    3. Environmental fit (from selected plant or position)
    4. Ecological value
  - The resulting list is constructed (e.g., Tomatillo *Physalis philadelphica*):
    - common names according to language settings (German or English), if available, then
    - a hyphen `-` (if there was a common name), then
    - *latin name* in italics
  - The matched part of the text should be bold.
- **Alternative scenario:**
- **Error scenario:**
  - No match can be found for what the user was searching for.  
    A message will be displayed that nothing was found.
- **Postcondition:**
  - The user has found the plant or a similar one to add to her map.
- **Non-functional Constraints:**
  - Performance
  - If there is a possible match in the database, it should be included (regardless of language settings etc.)
  - Search accuracy (stop words, stemming, etc.)
