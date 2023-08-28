Feature: Seed Creation
    As a user I want to be able to create seeds

    Background:
        Given I am on the seed management page

    Scenario: Successful seed creation
        When I provide all necessary details
        Then I can successfully create a new seed without an error message
