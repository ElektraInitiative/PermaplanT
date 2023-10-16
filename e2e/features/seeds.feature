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
        Then the edited seed is saved and displayed correctly

    Scenario: Successful searching seed
        When I search for a seed
        Then I can see the seed in the table

    Scenario: Searching seed that does not exists
        When I search for a seed that does not exist
        Then the search result is empty

    Scenario: Archving a seed
        When I try to archive a seed
        Then the seed dissapears
        And I have the possiblity to restore it
