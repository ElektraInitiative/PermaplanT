Feature: Planting Select
    As a user I want to be able to select multiple plants

    Background:
        Given I am on the SUT-PlantingSelect map page and I have planted something

    Scenario: Successfully selecting plants
        When I drag a select box over the canvas
        Then the plant is selected
