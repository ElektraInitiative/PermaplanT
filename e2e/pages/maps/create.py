from playwright.sync_api import Page
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage


class MapCreatePage(AbstractPage):
    """The map creation page of permaplant"""

    URL: str = E2E_URL + "maps/create"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self._page = page
        self._name = page.get_by_label("Name")
        self._description = page.get_by_label("Description")
        self._longitude = page.get_by_label("Longitude")
        self._latitude = page.get_by_label("Latitude")
        self._create_button = page.get_by_role("button", name="Create")
        self._privacy_select = page.get_by_test_id("select-menu__Privacy-select")

    def try_create_a_map(
        self,
        mapname,
        privacy="private",
        description="SUT-Description",
        latitude="1",
        longitude="1",
    ):
        """
        Helper function to create a map
        Fills out fields and clicks create at the end
        which navigate to the `MapManagementPage`
        """
        self.fill_name(mapname)
        self.select_privacy(privacy)
        self.fill_description(description)
        self.fill_latitude(latitude)
        self.fill_longitude(longitude)
        self.click_create(check_for_navigation=False)

    def create_a_map(
        self,
        mapname,
        privacy="private",
        description="SUT-Description",
        latitude="1",
        longitude="1",
    ):
        """
        Helper function to create a map
        Fills out fields and clicks create at the end
        which navigate to the `MapManagementPage`
        """
        self.fill_name(mapname)
        self.select_privacy(privacy)
        self.fill_description(description)
        self.fill_latitude(latitude)
        self.fill_longitude(longitude)
        self.click_create()

    def fill_name(self, name: str):
        self._name.fill(name)

    def select_privacy(self, privacy: str):
        """Selects the maps privacy."""
        self._privacy_select.click()
        self._page.get_by_role("option").get_by_text(privacy, exact=True).click()

    def fill_description(self, description: str):
        self._description.fill(description)

    def fill_longitude(self, longitude: str):
        self._longitude.fill(longitude)

    def fill_latitude(self, latitude: str):
        self._latitude.fill(latitude)

    def click_create(self, check_for_navigation=True):
        """
        Clicks create at the end
        which navigates to the `MapManagementPage`
        in case of success
        """
        self._create_button.click()

        if check_for_navigation:
            self._page.wait_for_url("**/maps")

    def expect_mapname_editable(self, mapname: str):
        """Checks if the mapname is editable"""
        self._name.fill(mapname)
