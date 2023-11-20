Feature: Planting Timeline
    As a user I want to be able to track timelines of my plants

    Background:
        Given I am on the SUT-Timeline map page and I have planted something

    Scenario: Hide a plant by changing the map date
        When I change the map date to yesterday
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
