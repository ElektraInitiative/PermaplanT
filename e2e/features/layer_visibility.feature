Feature: PermaplanT planting
    As a user I want to be able to change the layer visibilities

    Scenario: Successfully change plant layer visibility
        Given I am on the SUT-LayerVisibility map page and I have selected the plant layer
        When I plant something
        And I turn the plant layer visibility off
        Then all plants are invisible

    Scenario: Successfully change base layer visibility
        Given I am on the SUT-LayerVisibility map page and I have selected the base layer
        And I have an empty canvas before
        When I select a background image
        And I turn the base layer visiblity off
        Then the base layer is invisible
