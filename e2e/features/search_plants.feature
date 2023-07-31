Feature: Searching for Plants

  Background:
    Given I am on the SUTSearching map page and I have selected the plant layer

  Scenario Outline: Searching for plants with exact matches
    When I type <plant> into the search box
    Then the app should display <result> as first match
    Examples:
			| plant   | result |
			| tomato | Tomato (Solanum lycopersicum) |
			| potato | Potato (Solanum tuberosum) |
			| onion  | Onion (Allium cepa) |
			| popcorn  | Corn poppy (Papaver rhoeas) |

    Scenario Outline: Searching for plants with partial matches
    When I type <plant> into the search box
    Then the app should display <result> as first match
    Examples:
			| plant   | result |
			| toma | Tomato (Solanum lycopersicum) |
			| pota | Potato (Solanum tuberosum) |
			| onio  | Onion (Allium cepa) |
			| popco  | Corn poppy (Papaver rhoeas) |

  Scenario: No match was found
    When No match can be found for xyxyz
    Then A message will be displayed that nothing was found
