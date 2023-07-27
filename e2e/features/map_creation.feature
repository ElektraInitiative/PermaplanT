Feature: PermaplanT Map Creation

	Background:
		Given I am logged in and I am on the map management page

  	Scenario Outline: Successful map creation
		When I provides <name>, <privacy>, <description>, <latitude> and <longitude>
		Then I can successfully create a new map <name> without an error message
		Examples:
			| name            | privacy   | description         | latitude | longitude |
			| SUTPrivateMap   | private   | A private TestMap   | 25       | 25        |
			| SUTProtectedMap | protected | A protected TestMap | 1        | 1         |
			| SUTPublicMap    | public    | A public TestMap    | 33       | 33        |

    Scenario: Edit existing Map
        Given I create a new map
        When I edit the map
        Then I can successfully save it without an error message

	Scenario: Map already exists
        Given I create a map SUTSameMap
        When I try to create the same map SUTSameMap
        Then the app displays an error message
        And my map SUTSameMap is not created
