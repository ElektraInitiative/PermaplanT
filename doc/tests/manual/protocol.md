# Manual Test Protocol

## TC-001 - Plant Search

- Description: Show a selection of plants if the search input is empty.
- Given I am on a map page with the plant layer active
- When I have an empty search box
- Then I can see various plants as results
- Actual Result:
- Test Result:
- Notes:

## TC-002 - Heatmap

- Description: Test whether the heatmap endpoints generates the image correctly.
- Given I am on a map page with the plant layer active
- When I start planting a plant
- Then I see suitable places for that plant
- Actual Result:
- Test Result:
- Notes:

## TC-003 - Base Layer

- Description: Check whether the maps background image is displayed correctly.
- Given I am on a map page with the base layer active
- When I select a base layer image
- Then I can see the base layer image on the canvas
- Actual Result:
- Test Result:
- Notes:

## TC-004 - Grid

- Description: Display a point grid on the screen.
- Given I am on a map page
- When I Zoom in or out
- Then the grid spacing is changing
- Actual Result:
- Test Result:
- Notes:

## TC-005 - Map Editor Guided Tour

- Description: Check whether the Guided Tour leaves the Map Editor in its original state.
- Given I am on a map page
- When I do the Guided Tour
- Then after I have done the Guided Tour the map is the same as before
- Actual Result:
- Test Result:
- Notes:

## TC-006 - Map Editor Guided Tour

- Description: Guided Tour shows when not completed.
- Given I am on a map page
- When I have not completed the Guided Tour
- Then I can do the Guided Tour at any time
- Actual Result:
- Test Result:
- Notes:

## TC-007 - Map Editor Guided Tour

- Description: Guided Tour only shows when not completed or explicitly cancelled.
- Given I am on a map page
- When I have not completed the Guided Tour
- Then I can interrupt the Tour at any time and come back later
- Actual Result:
- Test Result:
- Notes:

## TC-008 - Chat: Create conversation

- Description: A conversation can be created
- Given I am on the chat page
- When I create a new conversation
- Then I can see the conversation in the conversation list
- Actual Result:
- Test Result:
- Notes: Currently only works with CORS disabled.

## TC-009 - Chat: Send message

- Description: Send a message to a Nextcloud conversation.
- Given I am on the chat page
- When I select a conversation
- Then I can send messages in that conversation
- Actual Result:
- Test Result:
- Notes: Currently only works with CORS disabled.

USE THIS TO CREATE A NEW TESTCASE.
DONT DELETE EMPTY BULLETPOINTS.
DONT FILL OUT ACTUAL/TEST RESULT.

<!-- ## TC-EXAMPLE - User Story
- Description: Show a selection of plants if the search input is empty.
- Given I create a new map SUT-EditMap
- When I edit SUT-EditMap to SUT-EditedMap with EditedDescription
- Then I can successfully save SUT-EditedMap without an error message
- Actual Result:
- Test Result:
- Notes: -->
