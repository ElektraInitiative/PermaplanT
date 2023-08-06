Feature: Searching for Plants

  Background:
    Given I am on the SUTSearching map page and I have selected the plant layer

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
    When No match can be found for xyxyz
    Then A message will be displayed that nothing was found
