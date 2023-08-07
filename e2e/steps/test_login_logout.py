from e2e.steps.common_steps import login
from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from pytest_bdd import scenarios, given, when, then, parsers


scenarios("features/login_logout.feature")


# Scenario 1: Successful login to PermaplanT


@given("I am on the PermaplanT homepage")
def permaplant_hp(hp: HomePage):
    hp.load()


@given("the login button is visible")
def login_button_is_visible(hp: HomePage):
    hp.login_button_is_visible()


@when(("I click the login button"))
def login_to_permaplant(hp: HomePage):
    hp.click_login_button()


@when(parsers.parse("I enter valid credentials"))
def enter_credentials(lp: LoginPage):
    lp.verify()
    lp.fill_username()
    lp.fill_password()


@when("I click the submit button")
def click_submit(lp: LoginPage):
    lp.click_sign_in()


@then("I should be redirected back to the homepage")
def verify_redirect(hp: HomePage):
    hp.verify()


@then("I should see a welcome message")
def verify_hello_message(hp: HomePage):
    hp.hello_message_is_visible()


# Scenario 2: Successful logout from PermaplanT


@given("I am logged in")
def verify_logged_in(hp: HomePage, lp: LoginPage):
    login(hp, lp)


@when("I click on the logout button")
def logout_from_permaplant(hp: HomePage):
    hp.click_logout_button()


@then("I should be logged out")
def verify_logged_out(hp: HomePage):
    hp.login_button_is_visible()
