# Manual Test Protocol

## TC-001 - Login

- Description: Successfully login to PermaplanT
- Preconditions:
- Test Steps:
  1. Press the login button on the navbar.
  2. Enter credentials.
  3. Press Login.
- Expected Result:
  - Get redirected to the homepage.
  - Be logged in.
  - See a Hello message pop up.
- Actual Result:
- Test Result:
- Notes:

## TC-002 - Translation

- Description: Switch language on website
- Preconditions:
- Test Steps:
  1. Change the language in the navbar
- Expected Result:
  - Language should be changed after selecting a new one.
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
  - Map should be successfully created.
- Actual Result:
- Test Result:
- Notes:

## TC-004 - Map Creation (Negative)

- Description: Can't create a map with a name that exists
- Preconditions:
  - Be logged in.
- Test Steps:
  1. Go to the map managment page.
  2. Create a map with a name that already exists.
  3. Enter valid stuff.
- Expected Result:
  - Map should not be created.
  - Error message pops up on the top right.
- Actual Result:
- Test Result:
- Notes:

## TC-005 - Plant Search

- Description: Show a selection of plants if the search input is empty.
- Preconditions:
  - No search input has been provided in the plant search.
- Test Steps:
  1. Naviagate to the map page.
  2. Select a map.
  3. Select the plant layer in the right map menu.
  4. Push the search icon in the lower right menu.
- Expected Result:
  - A selection of plants is shown to the user.
- Actual Result:
- Test Result:
- Notes:

## TC-006 - Plant Search

- Description: Return expected results for a given search in the selected language.
- Preconditions:
  - The search term "tomato" has been typed into the search field.
- Test Steps:
  1. Naviagate to the map page.
  2. Select a map.
  3. Select the plant layer in the right map menu.
  4. Push the search icon in the lower right menu.
  5. Write "tomato" into the search field.
- Expected Result:
  - The plants shown contain the string "tomato" in part of the datacolumns as outlined in the usecase document.
- Actual Result:
- Test Result:
- Notes:

## TC-007 - Plant Search

- Description: Returns results for searches in the language that was not selected.
- Preconditions:
  - The search term "fichte" has been typed into the search field.
- Test Steps:
  1. Navigate to the map page.
  2. Select a map.
  3. Select the plant layer in the right map menu.
  4. Push the search icon in the lower right menu.
  5. Write "fichte" into the search field.
- Expected Result:
  - Firs (german "Fichten") are part of the search results in addition to english matches.
  - Matches on english data fields are ranked above english matches.
- Actual Result:
- Test Result:
- Notes:

## TC-008 - Heatmap

- Description: Test whether the heatmap endpoints generates the image correctly.
- Preconditions:
  - Be on the map managment page.
  - TODO! @kitzbergerg
- Test Steps:
  1. Create a map
  2. Plant some plants with relations.
  3. TODO! @kitzbergerg
- Expected Result:
  - Heatmap considers map polygon and plant relations.
- Actual Result:
- Test Result:
- Notes:

## TC-009 - Timeline

- Description: Change the date of the map to 'hide' plantings.
- Preconditions:
  - User must be on the map planning screen.
- Test Steps:
  1. Add a planting to the map.
  2. Click on the date selection on the bottom of the screen.
  3. Navigate to a date in the past.
  4. Wait 1 second.
- Expected Result:
  - The indicator was briefly blue, indicating a loading state.
  - The indicator beside the input is green.
  - The Date on the bottom/right corner of the screen shows a date in the past.
  - The planting previously planted is gone.
- Actual Result:
- Test Result:
- Notes:

## TC-010 - Timeline

- Description: Change the date of the map to 'unhide' plantings.
- Preconditions:
  - User must be on the map planning screen.
- Test Steps:
  1. Add a planting to the map.
  2. Click on the date selection on the bottom of the screen.
  3. Navigate to a date in the past.
  4. Wait 1 second.
  5. Navigate to today.
- Expected Result:
  - The indicator was briefly blue, indicating a loading state.
  - The indicator beside the input is green.
  - The Date on the bottom/right corner of the screen shows the current day.
  - The planting previously planted was gone while being in the past.
  - The planting is visible again.
- Actual Result:
- Test Result:
- Notes:

## TC-011 - Timeline

- Description: Change the `add_date` of a planting to 'hide' it.
- Preconditions:
  - User must be on the map planning screen.
- Test Steps:
  1. Add a planting to the map.
  2. Click on the planting.
  3. Click on the `Add Date` date selector in the left lower toolbar.
  4. Change the date to a date in the future.
- Expected Result:
  - The indicator was briefly blue, indicating a loading state.
  - The indicator beside the input is green.
  - The planting previously planted is gone.
- Actual Result:
- Test Result:
- Notes:

## TC-012 - Timeline

- Description: Change the `remove_date` of a planting to 'hide' it.
- Preconditions:
  - User must be on the map planning screen.
  - The plants date has to be in the past.
- Test Steps:
  1. Add a planting to the map.
  2. Click on the planting.
  3. Click on the `Remove Date` date selector in the left lower toolbar.
  4. Change the date to today.
- Expected Result:
  - The indicator was briefly blue, indicating a loading state.
  - The indicator beside the input is green.
  - The planting previously planted is gone.
- Actual Result:
- Test Result:
- Notes:

## TC-013 - Timeline

- Description: Change the `add_date` of a planting to 'unhide' it.
- Preconditions:
  - User must be on the map planning screen.
- Test Steps:
  1. Add a planting to the map.
  2. Click on the planting.
  3. Click on the `Add Date` date selector in the left lower toolbar.
  4. Change the date to a date in the future.
  5. Wait one second
  6. Remove the date
- Expected Result:
  - The indicator was briefly blue, indicating a loading state.
  - The indicator beside the input is green.
  - The planting previously planted was gone while its `add_date` was in the future.
  - The planting is visible now with its `add_date` unset.
- Actual Result:
- Test Result:
- Notes:

## TC-014 - Base Layer

- Description: Check whether the maps background image is displayed correctly.
- Preconditions:
  - A map has been created.
  - The user has navigated to the map.
  - The base layer has to be selected as the active layer.
- Test Steps:
  1. Select a base layer image.
  2. Set the base layer rotation to 45 degrees.
  3. Scale the base layer image to 50 px per meter.
  4. Close and reopen the current map.
- Expected Result:
  - The selected base layer image is displayed after it has been selected.
  - Applying rotation was successful (the image is rotated by 45 degrees).
  - Applying scale was successful (the image is twice as large).
  - The state of the base layer does not change when closing and reopening the map.
- Actual Result:
- Test Result:
- Notes:

## TC-015 - Grid

- Description: Display a point grid on the screen.
- Preconditions:
  - User must be on the map screen.
- Test Steps:
  1. Press the grid button in the left upper menu bar.
  2. Zoom all the way in.
  3. Zoom all the way out.
- Expected Result:
  - The grid is displayed.
  - Each press on the grid button toggles the grid of/on.
  - Zooming in, grid spacing should switch from one meter to ten centimeters.
  - Zooming out, grid spacing should switch ten centimeters to one meter to ten meter.
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
  - User must be on the map managment screen.
  - XYZ must exist or be selected.
- Test Steps:
  1. Do this
  2. Do that
  3. Enter this
  4. Press this
- Expected Result:
  - Define a list of necessary results
  - ____ was successfully created.
  - Message was shown on the screen.
- Actual Result:
- Test Result:
- Notes:

LEAVE THE LAST 3 POINTS EMPTY.
-->
