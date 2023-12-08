Feature: Planting Timeline
    As a user I want to be able to track timelines of my plants

    Background:
        Given I am on the SUT-Timeline map page and I have planted something

    Scenario: Hide a plant by changing the map date by day
        When I change the map date to yesterday
        Then the plant disappears

    Scenario: Hide a plant by changing its added date
        When I change the plants added date to tomorrow
        Then the plant disappears

    Scenario: Hide a plant by changing its removed date
        When I change the plants removed date to yesterday
        Then the plant disappears

    Scenario: Unhide a plant by changing the map date by day
        When I change the plants added date to tomorrow
        And I change the map date to tomorrow
        Then the plant appears

    Scenario: Hide a plant by changing the map date by month
        When I change the map date to last month
        Then the plant disappears

    Scenario: Unhide a plant by changing the map date by month
        When I change the map date to next month
        Then the plant appears

    Scenario: Hide a plant by changing the map date by year
        When I change the map date to last year
        Then the plant disappears

    Scenario: Unhide a plant by changing the map date by year
        When I change the map date to next year
        Then the plant appears
