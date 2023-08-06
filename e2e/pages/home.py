import os
from playwright.sync_api import Page, expect

from e2e.pages.constants import E2E_TIMEOUT
from e2e.pages.abstract_page import AbstractPage


class HomePage(AbstractPage):
    """The homepage permaplant"""

    URL = os.getenv("E2E_URL", "localhost:5173")
    TITLE: str = "PermaplanT"
    HELLO_MSG: str = "Hello adi"

    def __init__(self, page: Page) -> None:
        self.page = page
        self.login_button = page.get_by_role("button", name="Log in")
        self.logout_button = page.get_by_role("button", name="Log out")
        self.hello_msg = page.get_by_text(self.HELLO_MSG, exact=True)
        self.map_management_button = page.get_by_role("button", name="Maps")

    def login_button_is_visible(self):
        expect(self.login_button).to_be_visible(timeout=E2E_TIMEOUT)

    def click_login_button(self):
        """
        Clicks the login button which
        navigates to the `LoginPage`.
        """
        self.login_button.click()

    def click_logout_button(self):
        self.logout_button.click()

    def hello_message_is_visible(self):
        expect(self.hello_msg).to_be_visible(timeout=E2E_TIMEOUT)

    def to_map_management_page(self):
        """
        Navigates to `MapManagementPage`.
        """
        self.map_management_button.click()
