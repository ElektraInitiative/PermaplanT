Feature: Planting
    As a user I want to be able plant something on my map

    Background:
        Given I am on the SUT-Planting map page and I have selected the plant layer

    Scenario: Successfully planting a plant
        When I place a tomato on the canvas
        Then it stays on SUT-Planting even when I leave the page and come back later
