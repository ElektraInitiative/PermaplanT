from playwright.sync_api import Page
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage


class MapEditPage(AbstractPage):
    """The map editing page of permaplant"""

    URL: str = E2E_URL + "/edit"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self._page = page
        self._name = page.get_by_label("Name *")
        self._description = page.get_by_label("Description")
        self._longitude = page.get_by_label("Longitude")
        self._latitude = page.get_by_label("Latitude")
        self._save_button = page.get_by_role("button", name="Save")
        self._privacy = page.locator("select")

    def fill_name(self, name):
        """Fills out the map name field."""
        self._name.fill(name)

    def select_privacy(self, privacy: str):
        """Selects the maps privacy."""
        self._privacy.select_option(privacy)

    def fill_description(self, description: str):
        """Fills out the map description field."""
        self._description.fill(description)

    def fill_longitude(self, longitude: str):
        """Fills out the map longitude field."""
        self._longitude.fill(longitude)

    def fill_latitude(self, latitude: str):
        """Fills out the map latitude field."""
        self._latitude.fill(latitude)

    def click_save(self):
        """
        Clicks save which
        navigates to the `MapManagementPage`.
        """
        self._save_button.click()
        self._page.wait_for_url("**/maps")
