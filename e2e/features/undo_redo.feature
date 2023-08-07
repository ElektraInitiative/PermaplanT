Feature: Planting Undo/Redo
    As a user I want to be able to undo and redo actions

    Background:
        Given I am on the SUTUndoRedo map page and I have planted something

    Scenario: Successful undo
        When I click undo
        Then my plant is gone

    Scenario: Successful redo after accidental undo
        When I accidentally clicked undo after planting one plant
        And I click redo to get my plant back
        Then I can see my plant on the canvas again
