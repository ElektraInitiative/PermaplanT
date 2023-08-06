from playwright.sync_api import Page
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage


class MapEditPage(AbstractPage):
    """The map editing page of permaplant"""

    URL: str = E2E_URL + "/edits"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self.page = page
        self.name = page.get_by_label("Name *")
        self.description = page.get_by_label("Description")
        self.longitude = page.get_by_label("Longitude")
        self.latitude = page.get_by_label("Latitude")
        self.save_button = page.get_by_role("button", name="Save")

    def fill_name(self, name):
        """Fills out the map name field."""
        self.name.fill(name)

    def select_privacy(self, privacy: str):
        """Selects the maps privacy."""
        self.page.locator("select").select_option(privacy)

    def fill_description(self, description: str):
        """Fills out the map description field."""
        self.description.fill(description)

    def fill_longitude(self, longitude: str):
        """Fills out the map longitude field."""
        self.longitude.fill(longitude)

    def fill_latitude(self, latitude: str):
        """Fills out the map latitude field."""
        self.latitude.fill(latitude)

    def click_save(self):
        """
        Clicks save which
        navigates to the `MapManagementPage`.
        """
        self.save_button.click()
        self.page.wait_for_url("**/maps")
