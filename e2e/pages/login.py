from e2e.pages.constants import E2E_USERNAME, E2E_PASSWORD
from playwright.sync_api import Page
from e2e.pages.abstract_page import AbstractPage


class LoginPage(AbstractPage):
    """The loginpage of permaplant"""

    URL: str = "auth"
    TITLE: str = "Sign in to PermaplanT"

    def __init__(self, page: Page):
        self.page = page
        self.sign_in_button = page.get_by_role("button", name="Sign In")
        self.password_field = page.get_by_label("Password")
        self.username_field = page.get_by_label("Username or email")

    def fill_username(self, username=E2E_USERNAME):
        """
        Fills the username field.
        Default to ENV variable.
        """
        self.username_field.fill(username)

    def fill_password(self, password=E2E_PASSWORD):
        """
        Fills the password field.
        Default to ENV variable.
        """
        self.password_field.fill(password)

    def click_sign_in(self):
        """
        Clicks sign in which
        navigates to the `HomePage`.
        """
        self.sign_in_button.click()
        self.page.wait_for_url("**/")
