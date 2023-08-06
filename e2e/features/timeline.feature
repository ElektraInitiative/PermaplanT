Feature: PermaplanT Timeline

    Background:
        Given I am on the SUTTimeline map page and a planting is added to the map

    Scenario: Hide a plant by changing the map date
        When I change the map date to tomorrow
        Then the plant disappears

    Scenario: Hide a plant by changing its added date
        When I change the plants added date to tomorrow
        Then the plant disappears

    Scenario: Hide a plant by changing its removed date
        When I change the plants removed date to yesterday
        Then the plant disappears

    Scenario: Unhide a plant by changing the map date
        When I change the plants added date to tomorrow
        And I change the map date to tomorrow
        Then the plant appears

    Scenario: Unhide a plant by changing its added date
        When I change the plants added date to yesterday
        And I change the plants added date to tomorrow
        Then the plant appears

    Scenario: Unhide a plant by changing its removed date
        When I change the plants removed date to yesterday
        And I change the plants removed date to tomorrow
        Then the plant appears
