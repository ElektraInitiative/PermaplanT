Feature: Undo/Redo
    As a user I want to be able to undo and redo actions

    Background:
        Given I am on the SUT-UndoRedo map page and I have planted something

    Scenario: Successful undo
        When I click undo
        Then my plant is gone

    Scenario: Successful redo after accidental undo
        When I accidentally clicked undo after planting one plant
        And I click redo
        Then I can see my plant on the canvas again

    Scenario: Successful undo deletion
        When I delete the plant
        And I click undo
        Then I can see my plant on the canvas again
