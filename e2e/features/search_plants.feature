Feature: Plant Search
    As a user I want to able to search for plants

    Background:
        Given I am on the SUT-Searching map page and I have selected the plant layer

    Scenario Outline: Searching for plants with exact/partial matches
        When I type <plant> into the search box
        Then the app should display <result> as first match
        Examples:
                | plant   | result                      |
                | tomato  | tomato Solanum lycopersicum |
                | tato    | potato Solanum tuberosum    |
                | nion    | onion Allium cepa           |
                | popco   | corn poppy Papaver rhoeas   |

    Scenario: No match was found
        When I type xyxyz into the search box
        Then no match can be found and a text is displayed
