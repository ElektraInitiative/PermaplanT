from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from pytest_bdd import scenarios, given, when, then, parsers

scenarios("features/login_logout.feature")


@given("I am on the PermaplanT homepage")
def permaplant_hp(hp: HomePage):
    hp.load()
    hp.verify()


@given("the login button is visible")
def login_button_is_visible(hp: HomePage):
    hp.login_button_is_visible()


@when(("I click the login button"))
def login_to_permaplant(hp: HomePage):
    hp.click_login_button()


@when(parsers.parse("I enter valid credentials {username} {password}"))
def enter_credentials(lp: LoginPage, username, password):
    lp.verify()
    lp.enter_username(username)
    lp.enter_password(password)


@when("I click the submit button")
def click_submit(lp: LoginPage):
    lp.click_sign_in()


@then("I should be redirected back to the homepage")
def verify_redirect(hp: HomePage):
    hp.verify()


@then("I should see a welcome message")
def verify_hello_message(hp: HomePage):
    hp.hello_message_is_visible()


@given("I am logged in")
def verify_logged_in(hp: HomePage, lp: LoginPage):
    hp.load()
    hp.verify()
    hp.login_button_is_visible()
    hp.click_login_button()
    lp.login("Adi", "1234")
    hp.verify()


@when("I click on the logout button")
def logout_from_permaplant(hp: HomePage):
    hp.click_logout_button()


@then("I should be logged out")
def verify_logged_out(hp: HomePage):
    hp.login_button_is_visible()
