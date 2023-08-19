Feature: Map Creation
    As a user I want to be able to create maps

    Background:
        Given I am on the map management page

    Scenario Outline: Successful map creation
        When I provide <name>, <privacy>, <description>, <latitude> and <longitude>
        Then I can successfully create <name> without an error message
        Examples:
            | name            | privacy   | description         | latitude | longitude |
            | SUT-PrivateMap   | private   | A private TestMap   | 25       | 25        |
            | SUT-ProtectedMap | protected | A protected TestMap | 1        | 1         |
            | SUT-PublicMap    | public    | A public TestMap    | 33       | 33        |

    Scenario: Edit existing Map
        Given I create a new map SUT-EditMap
        When I edit SUT-EditMap to SUT-EditedMap with EditedDescription
        Then I can successfully save SUT-EditedMap without an error message

    Scenario: Map already exists
        Given I create a map SUT-SameMap
        When I try to create the same map SUT-SameMap
        Then the app displays an error message
        And my map SUT-SameMap is not created
