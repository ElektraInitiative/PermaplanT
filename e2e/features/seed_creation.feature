Feature: Seed Creation
    As a user I want to be able to create seeds

    Background:
        Given I am on the seed management page

    Scenario: Successful seed creation
        When I create a new seed
        Then I can successfully create a new seed without an error message

    Scenario: Successful seed editing
        When I create another new seed
        And I edit this seed
        Then The edited seed is saved and displayed correctly
