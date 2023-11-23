from playwright.sync_api import Page, expect

from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage
from e2e.pages.maps.management import MapManagementPage
from e2e.pages.inventory.management import SeedManagementPage


class HomePage(AbstractPage):
    """The homepage permaplant"""

    URL = E2E_URL
    TITLE: str = "PermaplanT"
    HELLO_MSG: str = "Hello adi"

    def __init__(self, page: Page) -> None:
        self._page = page
        self._login_button = page.get_by_role("button", name="Log in")
        self._logout_button = page.get_by_role("button", name="Log out")
        self._hello_message = page.get_by_text(self.HELLO_MSG, exact=True)
        self._map_management_button = page.get_by_role("button", name="Maps")
        self._inventory_button = page.get_by_role("button", name="Inventory")

    def login_button_is_visible(self):
        expect(self._login_button).to_be_visible()

    def click_login_button(self):
        """
        Clicks the login button which
        navigates to the `LoginPage`.
        Waits for the backend to be ready before doing so.
        """
        self._page.get_by_test_id("login-button__is-loading").wait_for(state="detached")
        self._login_button.click()

    def click_logout_button(self):
        self._logout_button.click()
        self._page.wait_for_url("**/")

    def hello_message_is_visible(self):
        expect(self._hello_message).to_be_visible()

    def to_map_management_page(self) -> MapManagementPage:
        """
        Navigates to `MapManagementPage`.
        """
        self._map_management_button.click()
        self._page.wait_for_url("**/maps")
        return MapManagementPage(self._page)

    def to_inventory_page(self) -> SeedManagementPage:
        self._inventory_button.click()
        self._page.wait_for_url("**/seeds")
        return SeedManagementPage(self._page)
