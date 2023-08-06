from playwright.sync_api import Page, expect
from e2e.pages.constants import E2E_TIMEOUT, E2E_URL
from e2e.pages.abstract_page import AbstractPage


class MapManagementPage(AbstractPage):
    """The map management page of permaplant"""

    URL: str = E2E_URL + "/maps"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self.page = page
        self.create_button = page.get_by_role("button", name="New Map")

    def to_map_create_page(self):
        """Navigates to `MapCreatePage`"""
        self.create_button.click()

    def to_map_edit_page(self, mapname: str):
        """Navigates to `MapEditPage`"""
        self.page.get_by_title(mapname, exact=True).get_by_role(
            "button", name="Edit map"
        ).click()
        self.page.wait_for_url("**/edit")

    def to_map_planting_page(self, mapname: str):
        """Navigates to `MapPlantingPage`"""
        self.page.get_by_text(mapname, exact=True).click()

    def expect_mapname_is_visible(self, mapname: str):
        """Checks if the given map exists on the map management screen"""
        expect(self.page.get_by_text(mapname, exact=True)).to_be_visible(
            timeout=E2E_TIMEOUT
        )
