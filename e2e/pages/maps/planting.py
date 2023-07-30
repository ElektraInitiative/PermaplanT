from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeoutError
from ..abstract_page import AbstractPage


class MapPlantingPage(AbstractPage):
    """The planting page of a map on permaplant"""
    TITLE: str = 'PermaplanT'

    def __init__(self, page: Page):
        self.page = page
        self.base_layer_radio = self.page.get_by_role("radio", name="select layer").first
        self.plant_layer_radio = self.page.get_by_role("radio", name="select layer").nth(1)
        self.plant_search_icon = self.page.locator(".flex-shrink > div > .flex > .inline-flex").first
        self.plant_search_input = self.page.get_by_placeholder("Search plants...")
        self.delete_plant_button = self.page.get_by_role("button", name="Delete Planting")

    def check_base_layer(self):
        """Selects the base layer"""
        self.base_layer_radio.check()

    def check_plant_layer(self):
        """Selects the plant layer"""
        self.plant_layer_radio.set_checked(True, timeout=3000)

    def fill_plant_search(self, plantname):
        """Clicks the search icon and types plantname into the plant search"""
        self.plant_search_input.fill(plantname)

    def select_plant_from_search(self, plantname):
        """Selects a plant by name from the search results"""
        self.page.get_by_role("button", name=plantname).click()

    def close_tour(self):
        """
        Currently you get greeted with the tour.
        In case you rerun the tests locally, this should not fail.
        """
        try:
            self.tour_close = self.page.get_by_label("Close Tour")
            self.tour_close.click()
        except PlaywrightTimeoutError:
            print("Tour was already closed")

    def click_search_icon(self):
        """Click the search icon that enables the search box"""
        self.plant_search_icon.click()

    def click_on_canvas(self, x=300, y=300):
        """Clicks on the canvas. Default to x300 y300"""
        self.page.locator("canvas:nth-child(6)").click(position={"x": x,"y": y})

    def click_delete(self):
        """Deletes a planting by pressing on the delete button"""
        self.delete_plant_button.click()

    def search_result_is_visible(self, result):
        """Confirm a search result is visible"""
        expect(self.page.get_by_role("button", name=result)).to_be_visible()

    def no_plants_matching_query(self):
        """Confirm no plants are found is shown"""
        self.page.get_by_text("There are no plants matching your search query...")
