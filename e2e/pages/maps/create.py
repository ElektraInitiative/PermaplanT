from playwright.sync_api import Page
from ..abstract_page import AbstractPage


class MapCreatePage(AbstractPage):
    """The map create page of permaplant"""
    TITLE: str = 'PermaplanT'
    #//*[@id="root"]/div[1]/main/div/section/select
    def __init__(self, page: Page):
        self.page = page
        self.name = page.get_by_placeholder("Name *")
        self.description = page.get_by_placeholder("Description")
        self.longitude = page.get_by_placeholder("Longitude")
        self.latitude = page.get_by_placeholder("Latitude")
        self.create_button = page.get_by_role("button", name="Create")

    def create_a_map(self, mapname, privacy=None, description="SUTDescription", latitude="1", longitude="1"):
        """Helper function to create a map"""
        self.fill_name(mapname)
        # mcp.select_privacy(privacy)
        self.fill_description(description)
        self.fill_latitude(latitude)
        self.fill_longitude(longitude)
        self.click_create()

    def fill_name(self, name: str):
        self.name.fill(name)

    def select_privacy(self, privacy: str):
        self.page.locator("select").select_option(privacy)

    def fill_description(self, description: str):
        self.description.fill(description)

    def fill_longitude(self, longitude: str):
        self.longitude.fill(longitude)

    def fill_latitude(self, latitude: str):
        self.latitude.fill(latitude)

    def click_create(self):
        self.create_button.click()
