Feature: PermaplanT undo/redo

    Background:
    Given I am on the SUTUndoRedo map page and I have selected the plant layer

    Scenario: Successful undo
        When I plant something
        And I press undo
        Then my plant is gone

    Scenario: Successful redo after accidental undo
        When I accidentally pressed undo after planting one plant
        And I press redo to get my plant back
        Then I can see my plant on the canvas again
