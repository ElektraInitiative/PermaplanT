from playwright.sync_api import Page, expect
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.planting import MapPlantingPage


class MapManagementPage(AbstractPage):
    """The map management page of permaplant"""

    URL: str = E2E_URL + "/maps"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self._page = page
        self._create_button = page.get_by_role("button", name="New Map")

    def to_map_create_page(self) -> MapCreatePage:
        """Navigates to `MapCreatePage`"""
        self._create_button.click()
        self._page.wait_for_url("**/create")
        return MapCreatePage(self._page)

    def to_map_edit_page(self, mapname: str):
        """Navigates to `MapEditPage`"""
        self._page.get_by_title(mapname, exact=True).get_by_role(
            "button", name="Edit map"
        ).click()
        self._page.wait_for_url("**/edit")

    def to_map_planting_page(self, mapname: str) -> MapPlantingPage:
        """Navigates to `MapPlantingPage`"""
        self._page.get_by_text(mapname, exact=True).click()
        self._page.wait_for_url("**/maps/*")
        return MapPlantingPage(self._page)

    def expect_mapname_is_visible(self, mapname: str):
        """Checks if the given map exists on the map management screen"""
        expect(self._page.get_by_text(mapname, exact=True)).to_be_visible()
