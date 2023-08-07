Feature: PermaplanT undo/redo

    Background:
    Given I am on the SUTUndoRedo map page and I have selected the plant layer

    Scenario: Successful undo
        When I plant something
        And I click undo
        Then my plant is gone

    Scenario: Successful redo after accidental undo
        When I plant something
        And I accidentally clicked undo after planting one plant
        And I click redo to get my plant back
        Then I can see my plant on the canvas again
