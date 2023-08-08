Feature: PermaplanT base layer
    As a user I want to be able to have a base layer

  Background:
    Given I am on the SUTBaseLayer map page and I have selected the base layer

    Scenario: Successfully select a background image
        When I select the background image Birdie.jpg
        Then /Photos/Birdie.jpg stays even when I leave SUTBaseLayer and come back later

    Scenario: Successfully rotate a background image
        When I change the rotation of the image to 45 degrees
        Then SUTBaseLayer image rotation is set to 45 degrees

    Scenario: Successfully scale a background image
        When I change the scale of the image to 120 percent
        Then SUTBaseLayer image scale is set to 120 percent
