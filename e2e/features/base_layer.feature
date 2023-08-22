Feature: Base layer
    As a user I want to be able to have a base layer

  Background:
    Given I am on the SUT-BaseLayer map page and I have selected the base layer

    Scenario: Successfully select a background image
        When I select a background image
        Then /Photos/Birdie.jpg stays even when I leave SUT-BaseLayer and come back later

    Scenario: Successfully rotate a background image
        When I change the rotation of the image to 45 degrees
        Then SUT-BaseLayer image rotation is set to 45 degrees

    Scenario: Successfully scale a background image
        When I change the scale of the image to 120 percent
        Then SUT-BaseLayer image scale is set to 120 percent
