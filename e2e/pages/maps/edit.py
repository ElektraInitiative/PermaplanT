from playwright.sync_api import Page
from ..abstract_page import AbstractPage


class MapEditPage(AbstractPage):
    """The map editing page of permaplant"""
    TITLE: str = 'PermaplanT'

    def __init__(self, page: Page):
        self.page = page
        self.name = page.get_by_label("Name *")
        self.description = page.get_by_label("Description")
        self.longitude = page.get_by_label("Longitude")
        self.latitude = page.get_by_label("Latitude")
        self.save_button = page.get_by_role("button", name="Save")

    def fill_name(self, name):
        self.name.fill(name)

    def select_privacy(self, privacy: str):
        self.page.locator("select").select_option(privacy)

    def fill_description(self, description: str):
        self.description.fill(description)

    def fill_longitude(self, longitude: str):
        self.longitude.fill(longitude)

    def fill_latitude(self, latitude: str):
        self.latitude.fill(latitude)

    def click_save(self):
        """
        Clicks save which
        navigates to the `MapManagementPage`
        """
        self.save_button.click()
