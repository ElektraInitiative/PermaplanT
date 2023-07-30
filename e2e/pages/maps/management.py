from playwright.sync_api import Page, expect
from ..abstract_page import AbstractPage


class MapManagementPage(AbstractPage):
    """The map management page of permaplant"""
    TITLE: str = 'PermaplanT'

    def __init__(self, page: Page):
        self.page = page
        self.create_button = page.get_by_role("button", name="New Map")

    def to_map_create_page(self):
        self.create_button.click()

    def to_map_edit_page(self, mapname: str):
        self.page.get_by_title(mapname, exact=True).get_by_role("button", name="Edit map").click()

    def to_map_planting_page(self, mapname: str):
        """Navigate to the planting page of a map"""
        self.page.get_by_text(mapname).click()

    def visible(self, mapname: str):
        """Checks if the given map exists on the map management screen"""
        expect(self.page.get_by_text(mapname, exact=True)).to_be_visible()

    def not_visible(self, mapname: str):
        """Checks if the given map exists on the map management screen"""
        expect(self.page.get_by_text(mapname, exact=True)).not_to_be_visible()
