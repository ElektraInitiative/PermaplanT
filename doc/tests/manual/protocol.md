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

## Heatmap

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

## Additional name on map: plant labels

- Description: Test additional names being displayed properly.
- Given I am on the map page with the plants layer active
- When I create a new plant from a seed.
- Then I can see the additional name on the label when hovering over the plant.
- Actual Result:
- Test Result:
- Notes: The additional name must also be visible when a different account views the same map in parallel.

## Additional name on map: left toolbar

- Description: Test additional names being displayed properly.
- Given I am on the map page with the plants layer active
- When I create a new plant from a seed.
- When I click on the new plant icon.
- Then I can see the additional name in the left toolbars heading.
- Actual Result:
- Test Result:
- Notes: The additional name must also be visible when a different account views the same map in parallel.

## Additional name on map: updates

- Description: Test additional names being displayed properly.
- Given I am on the map page with the plants layer active
- When I create a new plant from a seed.
- When I go to the inventory page and change the seeds name.
- Then I can see the changes in the plant label and left toolbar.
- Actual Result:
- Test Result:
- Notes: The additional name must also be visible when a different account views the same map.

## Shade layer: add shading

- Description: Add a new Shading to the map.
- Given I am on the map page with the shade layer active
- When I click on the 'Light' button
- When I click on the map
- Then I can see that a new shading was added
- Actual Result:
- Test Result:
- Notes: Repeat this test for all Shading types

## Shade layer: remove shading

- Description: Remove a Shading from the map.
- Given I am on the map page with the shade layer active and a Shading is selected
- When I click on 'Delte' in the left toolbar
- Then I can see that a new shading was deleted
- Actual Result:
- Test Result:

## Shade layer: edit shade type

- Description: Change the shade of a shading.
- Given I am on the map page with the shade layer active and a Shading is selected
- When I select different shade from the drop-down menu in the left toolbar
- Then I can see that the shade is changed successfully
- Actual Result:
- Test Result:
- Notes: select each shading type at least once

## Shade layer: set creation date in the future

- Description: Update the date from which the shading should be active
- Given I am on the map page with the shade layer active and a Shading is selected
- When I select the current date in the timeline
- When I select a creation date in the future
- Then I can see that the shading is no longer shown on the map
- Actual Result:
- Test Result:

## Shade layer: set creation date in the past

- Description: Update the date from which the shading should be active
- Given I am on the map page with the shade layer active and a Shading is selected
- When I select the current date in the timeline
- When I select a creation date in the past
- Then I can see that the shading is shown on the map
- Actual Result:
- Test Result:

## Shade layer: set removal date in the future

- Description: Update the date from which the shading should be active
- Given I am on the map page with the shade layer active and a Shading is selected
- When I select the current date in the timeline
- When I select a creation date in the past
- When I select a removal date in the future
- Then I can see that the shading is shown on the map
- Actual Result:
- Test Result:

## Shade layer: set removal date in the past

- Description: Update the date until which the shading should be active
- Given I am on the map page with the shade layer active and a Shading is selected
- When I select the current date in the timeline
- When I select a creation date in the past
- When I select a removal date in the past after the creation date
- Then I can see that the shading is no longer shown on the map
- Actual Result:
- Test Result:

## Shade layer: add polygon point

- Description: Edit the polygon of a shading
- Given I am on the map page with the shade layer active and a Shading is selected
- When I press the pencil button in the left toolbar
- Then I can see that a message describing the selected action is shown in the status bar
- Then I can see that a highlighted border is drawn around the polygon
- When I click anywhere on the map
- Then I can see that a point has been added to the nearest polygon edge
- Actual Result:
- Test Result:

## Shade layer: remove polygon point

- Description: Edit the polygon of a shading
- Given I am on the map page with the shade layer active and a Shading is selected
- When I press the eraser button in the left toolbar
- Then I can see that a message describing the selected action is shown in the status bar
- Then I can see that a highlighted border is drawn around the polygon
- When I click on a polygon point
- Then I can see that the point has been removed from the polygon
- Actual Result:
- Test Result:

## Shade layer: move polygon point

- Description: Edit the polygon of a shading
- Given I am on the map page with the shade layer active and a Shading is selected
- When I press the cursor button in the left toolbar
- Then I can see that a message describing the selected action is shown in the status bar
- Then I can see that a highlighted border is drawn around the polygon
- When I drag and release a polygon point
- Then I can see that the point is now at a new position
- Actual Result:
- Test Result:
