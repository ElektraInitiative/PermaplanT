# Manual Test Protocol

<!--
The blueprint of all test cases.
The protocol depicts the unperformed manual test.
The protocol is written in GIVEN-WHEN-THEN Gherkin syntax:
- [automationpanda.com](https://automationpanda.com/2017/01/30/bdd-101-writing-good-gherkin/)
- [cucumber.io](https://cucumber.io/docs/bdd/better-gherkin/)


USE THIS TO CREATE A NEW TESTCASE.
DONT DELETE EMPTY BULLETPOINTS.
DONT FILL OUT ACTUAL/TEST RESULT.

## Use Case
- Description: Edit a map.
- Given there is already a created map
- When I change my maps name and description
- Then I can successfully save my new map without an error message
- Actual Result:
- Test Result:
- Notes: -->

## Plant Search

- Description: Show a selection of plants if the search input is empty.
- Given I am on a map page with the plant layer active
- When I have an empty search box
- Then I can see various plants as results
- Actual Result:
- Test Result:
- Notes:

## Heatmap (NOT IMPLEMENTED)

- Description: Test whether the heatmap endpoints generates the image correctly.
- Given I am on a map page with the plant layer active
- When I start planting a plant
- Then I see suitable places for that plant
- Actual Result:
- Test Result:
- Notes:

## Layer opacity

- Description: Check whether the opacity of a layer changes.
- Given I am on a map page with a base layer image configured
- When dragging the slider for the base layer in the layer section of the toolbar to 50%
- Then I can see the change in opacity of the base layer image
- When I change the size of the toolbar
- Then I can see the slider and the filling change in size proportionally. Therefore 50% of the slider should be filled.
- Actual Result:
- Test Result:
- Notes:

## Base Layer

- Description: Check whether the maps background image is displayed correctly.
- Given I am on a map page with the base layer active
- When I select a base layer image
- Then I can see the base layer image on the canvas
- Actual Result:
- Test Result:
- Notes:

## Grid

- Description: Display a point grid on the screen.
- Given I am on a map page
- When I Zoom in or out
- Then the grid spacing is changing
- Actual Result:
- Test Result:
- Notes:

## Map Editor Guided Tour

- Description: Check whether the Guided Tour leaves the Map Editor in its original state.
- Given I am on a map page
- When I do the Guided Tour
- Then after I have done the Guided Tour the map is the same as before
- Actual Result:
- Test Result:
- Notes:

## Map Editor Guided Tour

- Description: Guided Tour shows when not completed.
- Given I am on a map page
- When I have not completed the Guided Tour
- Then I can do the Guided Tour at any time
- Actual Result:
- Test Result:
- Notes:

## Map Editor Guided Tour

- Description: Guided Tour only shows when not completed or explicitly cancelled.
- Given I am on a map page
- When I have not completed the Guided Tour
- Then I can interrupt the Tour at any time and come back later
- Actual Result:
- Test Result:
- Notes:

## Edit seed

- Description: Edit seed.
- Preconditions:
  - User is on the view seed page.
- Test Steps:
  1. Press Button "Edit seed"
  2. Change an attribute of the seed.
  3. Submit the form.
  4. Repeat steps 1 through 3 for every seed attribute.
- Expected Result:
  - The seed attributes updated successfully.
- Actual Result:
- Test Result:
- Notes:

## Delete seed

- Description: Edit seed.
- Preconditions:
  - User is on the view seed page.
- Test Steps:
  1. Press Button "Delete seed"
- Expected Result:
  - The selected seed is no longer available.
- Actual Result:
- Test Result:
- Notes:

## Chat: Create conversation (NOT IMPLEMENTED)

- Description: A conversation can be created
- Given I am on the chat page
- When I create a new conversation
- Then I can see the conversation in the conversation list
- Actual Result:
- Test Result:
- Notes: Currently only works with CORS disabled.

## Chat: Send message (NOT IMPLEMENTED)

- Description: Send a message to a Nextcloud conversation.
- Given I am on the chat page
- When I select a conversation
- Then I can send messages in that conversation
- Actual Result:
- Test Result:
- Notes: Currently only works with CORS disabled.
