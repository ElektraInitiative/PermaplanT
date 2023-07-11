
Feature: Login and Logout

    Background:
    Given Open PermaplanT Homepage

    Scenario: User can log in and log out successfully
        When Login to PermaplanT with Adi and 1234
        Then Verify that the current user is logged in
        When Logout from PermaplanT
        Then Verify on Homepage and logged out
