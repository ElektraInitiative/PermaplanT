Feature: PermaplanT Login and Logout Functionality
    As a user I want to be able to login and logout successfully

    Scenario: Successful Login
        Given I am on the PermaplanT homepage
        When I click the login button
        And I enter valid credentials Adi 1234
        And I click the submit button
        Then I should be redirected back to the homepage
        And I should see a welcome message

    Scenario: Successful logout
        Given I am logged in
        When I click on the logout button
        Then I should be logged out
