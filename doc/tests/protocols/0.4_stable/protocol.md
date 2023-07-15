# Manuel Test Protocol

## TC-001 - Login

- Description: Successfully login to PermaplanT
- Preconditions:
- Test Steps:
  1. Press the login button on the navbar.
  2. Enter credentials.
  3. Press Login.
- Expected Result:
  - [ ] Get redirected to the homepage.
  - [ ] Be logged in.
  - [ ] See a Hello message pop up.
- Actual Result:
- Test Result:
- Notes:

## TC-002 - Translation

- Description: Switch language on website
- Preconditions:
- Test Steps:
  1. Change the language in the navbar
- Expected Result:
  - [ ] Language should be changed after selecting a new one.
- Actual Result:
- Test Result:
- Notes:

## TC-003 - Use Case: Map Creation

- Description: Successfully create a new map.
- Preconditions:
  - Be logged in.
- Test Steps:
  1. Go to the map managment page.
  2. Create a new map.
  3. Enter valid stuff.
- Expected Result:
  - [ ] Map should be successfully created.
- Actual Result:
- Test Result:
- Notes:

## TC-003 - Map Creation (Negative)

- Description: Can't create a map with a name that exists
- Preconditions:
  - Be logged in.
- Test Steps:
  1. Go to the map managment page.
  2. Create a map with a name that already exists.
  3. Enter valid stuff.
- Expected Result:
  - [ ] Map should not be created.
  - [ ] Error message pops up on the top right.
- Actual Result:
- Test Result:
- Notes:

## TC-004 - Plant Search

- Description: Show a selection of plants if the search input is empty.
- Preconditions:
  - [ ] No search input has been provided in the plant search.
- Test Steps:
  1. Naviagate to the map page.
  2. Select a map.
  3. Select the plant layer in the right map menu.
  4. Push the search icon in the lower right menu.
- Expected Result:
  - [ ] A selection of plants is shown to the user.
- Actual Result:
- Test Result:
- Notes:

## TC-005 - Plant Search

- Description: Return expected results for a given search in the selected language.
- Preconditions:
  - [ ] The search term "tomato" has been typed into the search field.
- Test Steps:

  1. Naviagate to the map page.
  2. Select a map.
  3. Select the plant layer in the right map menu.
  4. Push the search icon in the lower right menu.
  5. Write "tomato" into the search field.

- Expected Result:
  - [ ] The plants shown contain the string "tomato" in part of the datacolumns as outlined in the usecase document.
- Actual Result:
- Test Result:
- Notes:

## TC-006 - Plant Search

- Description: Returns results for searches in the language that was not selected.
- Preconditions:
  - [ ] The search term "fichte" has been typed into the search field.
- Test Steps:

  1. Navigate to the map page.
  2. Select a map.
  3. Select the plant layer in the right map menu.
  4. Push the search icon in the lower right menu.
  5. Write "fichte" into the search field.

- Expected Result:
  - [ ] Firs (german "Fichten") are part of the search results in addition to english matches.
  - [ ] Matches on english data fields are ranked above english matches.
- Actual Result:
- Test Result:
- Notes:

<!--
DONT DELETE THIS.
USE THIS TO CREATE A NEW TESTCASE.
DONT DELETE ANY BULLETPOINT.

## TC-EXAMPLE - User story
- Description: Show a selection of plants if the search input is empty.
- Preconditions:
  - [ ] User must be on the map managment screen.
  - [ ] XYZ must exist or be selected.
- Test Steps:
  1. Do this
  2. Do that
  3. Enter this
  4. Press this
- Expected Result:
  - [ ] Define a list of necessary results
  - [ ] ____ was successfully created.
  - [ ] Message was shown on the screen.
- Actual Result:
- Test Result:
- Notes:

LEAVE THE LAST 3 POINTS EMPTY.
-->
