Feature: PermaplanT planting
    As a user I want to be able to change the layer visibilities

  Background:
    Given I am on the SUTLayerVisibility map page

    Scenario: Successfully change plant layer visibility
        When I turn the plant layer visiblity off
        Then all plants are invisible

    Scenario: Successfully change base layer visibility
        When I turn the base layer visiblity off
        Then the base layer is invisible

    Scenario: Successfully change plant layer opacity
        When I lower the opacity of the plant layer
        Then all plants opacity gets lowered

    Scenario: Successfully change base layer opacity
        When I lower the opacity of the base layer
        Then the base layers opacity gets lowered
