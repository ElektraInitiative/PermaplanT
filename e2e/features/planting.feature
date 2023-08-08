Feature: PermaplanT planting
    As a user I want to be plant something on my map

    Background:
        Given I am on the SUTPlanting map page and I have selected the plant layer

    Scenario: Successfully planting a plant
        When I place a tomato on the canvas
        Then it stays on SUTPlanting even when I leave the page and come back later
