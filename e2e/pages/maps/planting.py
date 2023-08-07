from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeoutError
from e2e.pages.abstract_page import AbstractPage
from e2e.pages.constants import E2E_URL


class MapPlantingPage(AbstractPage):
    """The planting page of a map on permaplant"""

    URL: str = E2E_URL + "/maps/"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self.page = page
        # Plant layer
        self.base_layer_radio = self.page.get_by_test_id("base-layer-radio")
        self.plant_layer_radio = self.page.get_by_test_id("plants-layer-radio")
        self.plant_search_icon = self.page.get_by_test_id("plant-search-icon")
        self.plant_search_input = self.page.get_by_test_id("plant-search-input")
        self.delete_plant_button = self.page.get_by_role(
            "button", name="Delete Planting"
        )
        self.map_management_button = self.page.get_by_role("button", name="Maps")
        self.canvas = self.page.get_by_test_id("canvas")
        self.undo_button = self.page.get_by_test_id("undo-button")
        self.redo_button = self.page.get_by_test_id("redo-button")
        self.hide_plant_layer = self.page.get_by_test_id("plants-layer-visibility-icon")
        # Base layer
        self.hide_base_layer = self.page.get_by_test_id("base-layer-visibility-icon")
        self.background_select = self.page.get_by_test_id("baseBackgroundSelect")
        self.background_button = page.get_by_role("button", name="Choose an image")
        self.rotation_input = self.page.get_by_test_id("rotation-input")
        self.scale_input = self.page.get_by_test_id("scale-input")

    """ACTIONS"""

    def check_base_layer(self):
        """Checks the base layer radio button."""
        self.base_layer_radio.set_checked(True)

    def check_plant_layer(self):
        """Ckecks the plant layer radio button."""
        self.plant_layer_radio.set_checked(True)

    def fill_plant_search(self, plantname):
        """Clicks the search icon and types plantname into the plant search."""
        self.plant_search_input.fill(plantname)

    def fill_rotation(self, rotation):
        """Fills the rotation input according to rotation."""
        self.rotation_input.fill(rotation)
        # Wait for input to be processed and saved
        self.page.wait_for_timeout(2000)

    def fill_scaling(self, scaling):
        """Fills the scaling input according to scaling."""
        self.scale_input.fill(scaling)
        # Wait for input to be processed and saved
        self.page.wait_for_timeout(2000)

    def close_tour(self):
        """
        Currently you get greeted with the tour.
        In case you rerun the tests locally or if this gets removed
        it is wrapped, so it does not fail the tests.
        The timeout is also lowered to not slow down the tests by a lot.
        """
        try:
            tour_close = self.page.get_by_label("Close Tour")
            tour_close.click(timeout=7000)
            tour_close_confirmation = self.page.get_by_role("button", name="End")
            tour_close_confirmation.click(timeout=7000)
        except PlaywrightTimeoutError:
            print("Tour was already closed")

    def click_search_icon(self):
        """Click the search icon that enables the search box."""
        self.plant_search_icon.click()

    def click_plant_from_search_results(self, plant_name):
        """Selects a plant by name from the search results."""
        self.page.get_by_test_id(plant_name + "-plant-search-result").click()

    def click_on_canvas_middle(self):
        """Clicks in the middle of the canvas with a 300ms delay."""
        box = self.canvas.bounding_box()
        self.page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        self.page.wait_for_timeout(300)

    def click_delete(self):
        """Deletes a planting by clicks on the delete button."""
        self.delete_plant_button.click()

    def click_undo(self):
        """Clicks the undo button."""
        self.undo_button.click()

    def click_redo(self):
        """Clicks the redo button."""
        self.redo_button.click()

    def click_background_image(self, name):
        """
        Selects the background image by name
        and performs a short delay.
        """
        self.background_button.click()
        self.page.get_by_text(name).click()
        # Delay so image can be rendered on canvas
        self.page.wait_for_timeout(2000)

    def click_hide_base_layer(self):
        self.hide_base_layer.click()

    def click_hide_plant_layer(self):
        self.hide_plant_layer.click()
        self.page.wait_for_timeout(5000)

    def expect_plant_on_canvas(self, plant_name):
        """
        Confirms that the plant is on the canvas,
        by clicking in the middle of the canvas
        and looking at the left side bar for a delete button.
        """
        self.click_on_canvas_middle()
        expect(self.delete_plant_button).to_be_visible()
        expect(self.page.get_by_role("heading", name=plant_name)).to_be_visible()

    def expect_no_plant_on_canvas(self):
        """
        Confirms there is no plant on the canvas,
        by clicking in the middle of the canvas
        and making sure the delete button is not visible.
        """
        self.click_on_canvas_middle()
        expect(self.delete_plant_button).not_to_be_visible()

    def expect_search_result_is_visible(self, result):
        """Confirms that a search result is visible."""
        expect(
            self.page.get_by_test_id(result + "-plant-search-result")
        ).to_be_visible()

    def expect_no_plants_found_text_is_visible(self):
        """Confirms that `no plants are found` is present."""
        expect(self.page.get_by_test_id("plant-search-results-empty")).to_be_visible()

    def expect_background_image(self, name):
        expect(self.background_select).to_have_value(name)

    def expect_rotation_to_have_value(self, val):
        """Expects that the rotation is properly set."""
        expect(self.rotation_input).to_have_value(val)

    def expect_scaling_to_have_value(self, val):
        """Expects that the scaling is properly set."""
        expect(self.scale_input).to_have_value(val)

    """NAVIGATION"""

    def to_map_management_page(self):
        """
        Clicks the button on the navbar which
        navigates to the `MapManagementPage`.
        """
        self.map_management_button.click()
        self.page.wait_for_url("**/maps")
