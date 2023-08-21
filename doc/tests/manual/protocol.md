# Manual Test Protocol

## TC-001 - Plant Search

- Description: Show a selection of plants if the search input is empty.
- Preconditions:
  - No search input has been provided in the plant search.
- Test Steps:
  1. Navigate to the map page.
  2. Select a map.
  3. Select the plant layer in the right map menu.
  4. Push the search icon in the lower right menu.
- Expected Result:
  - A selection of plants is shown to the user.
- Actual Result:
- Test Result:
- Notes:

## TC-002 - Plant Search

- Description: Returns results for searches in the language that was selected.
- Preconditions:
  - Language English has been selected
- Test Steps:
  1. Navigate to the map page.
  2. Select a map.
  3. Select the plant layer in the right map menu.
  4. Push the search icon in the lower right menu.
  5. Write "Tomato" and "Potato" into the search field.
- Expected Result:
  - "Tomato" and "Potato" should be the first match.
- Actual Result:
- Test Result:
- Notes:

## TC-003 - Heatmap

- Description: Test whether the heatmap endpoints generates the image correctly.
- Preconditions:
  - Be on the map editor page.
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

## TC-004 - Base Layer

- Description: Check whether the maps background image is displayed correctly.
- Preconditions:
  - A map has been created.
  - The user has navigated to the map editor.
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

## TC-005 - Grid

- Description: Display a point grid on the screen.
- Preconditions:
  - User must be in the map editor.
- Test Steps:
  1. Press the grid button in the left upper menu bar.
  2. Zoom all the way in.
  3. Zoom all the way out.
- Expected Result:
  - The grid is not displayed anymore.
  - Each press on the grid button toggles the grid off/on.
  - Zooming in, grid spacing should switch from one meter to ten centimeters.
  - Zooming out, grid spacing should switch ten centimeters to one meter to ten meter.
- Actual Result:
- Test Result:
- Notes:

## TC-006 - Map Editor Guided Tour

- Description: Check whether the Guided Tour leaves the Map Editor in its original state.
- Preconditions:
  - User must not have completed the Guided Tour prior.
  - User must be on the map editor screen.
- Test Steps:
  1. Follow the Guided Tour until its end.
  2. Do every step exactly as stated.
- Expected Result:
  - There are no plants on the map.
  - The map date is set to the current date.
  - Placement mode is not active.
- Actual Result:
- Test Result:
- Notes:

## TC-007 - Map Editor Guided Tour

- Description: Guided Tour only shows when not completed or explicitly cancelled.
- Preconditions:
  - User must not have completed the Guided Tour prior.
  - User must be on the map editor screen.
- Test Steps:
  1. Leave the page by entering a different URL or using the browsers navigate back button.
  2. Return to the map editor screen.
  3. Use the cancel button on the Tour step or press ESC.
  4. Reload the page.
- Expected Result:
  - The Guided Tour will show again after returning to the map editor screen.
  - After the page reload, the Guided Tour will not be displayed.
- Actual Result:
- Test Result:
- Notes:

## TC-008 - Chat: Create conversation

- Description: A conversation can be created at /chat
- Preconditions:
  - User must be logged in.
- Test Steps:
  1. Navigate to /chat and click create conversation
  2. Fill out the Invite with a valid Nextcloud user id.
  3. Type a name of choice in the Room Name field.
  4. Click submit.
- Expected Result:
  - The conversation is created in Nextcloud.
  - The conversation will appear in the conversation list after some time.
- Actual Result:
- Test Result:
- Notes: Currently only works with CORS disabled.

## TC-009 - Chat: Send message

- Description: Send a message to a Nextcloud conversation.
- Preconditions:
  - User must be logged in.
  - A conversation for the user must exist.
- Test Steps:
  1. Navigate to /chat and select an available conversation
  2. Type a message in the message field.
  3. Click Send.
- Expected Result:
  - The message is sent to the chat and appears in Nextcloud.
  - A success message is displayed.
  - The message will appear in the conversation history after at most 5 seconds.
- Actual Result:
- Test Result:
- Notes: Currently only works with CORS disabled.

<!--
DONT DELETE THIS.
USE THIS TO CREATE A NEW TESTCASE.
DONT DELETE ANY BULLETPOINT.

## TC-EXAMPLE - User story
- Description: Show a selection of plants if the search input is empty.
- Preconditions:
  - User must be on the map editor screen.
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
