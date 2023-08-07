import cv2
import numpy as np
from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeoutError
from e2e.pages.abstract_page import AbstractPage
from e2e.pages.constants import E2E_URL


class MapPlantingPage(AbstractPage):
    """The planting page of a map on permaplant"""

    URL: str = E2E_URL + "/maps/"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self._page = page
        self._screenshot = None
        """ Selectors """
        # Navbar
        self._map_management_button = page.get_by_role("button", name="Maps")
        # Left side bar
        self._delete_plant_button = page.get_by_role("button", name="Delete Planting")
        # Layer visibility
        self._hide_plant_layer = page.get_by_test_id("plants-layer-visibility-icon")
        self._hide_base_layer = page.get_by_test_id("base-layer-visibility-icon")
        # Canvas
        self._canvas = page.get_by_test_id("canvas")
        self._close_selected_plant = page.get_by_test_id("canvas").get_by_role("button")
        # Top left section
        self._undo_button = page.get_by_test_id("undo-button")
        self._redo_button = page.get_by_test_id("redo-button")
        # Plant layer
        self._base_layer_radio = page.get_by_test_id("base-layer-radio")
        self._plant_layer_radio = page.get_by_test_id("plants-layer-radio")
        self._plant_search_icon = page.get_by_test_id("plant-search-icon")
        self._plant_search_input = page.get_by_test_id("plant-search-input")
        # Base layer
        self._background_select = page.get_by_test_id("baseBackgroundSelect")
        self._background_button = page.get_by_role("button", name="Choose an image")
        self._rotation_input = page.get_by_test_id("rotation-input")
        self._scale_input = page.get_by_test_id("scale-input")

    """ACTIONS"""

    def check_base_layer(self):
        """Checks the base layer radio button."""
        self._base_layer_radio.set_checked(True)

    def check_plant_layer(self):
        """Ckecks the plant layer radio button."""
        self._plant_layer_radio.set_checked(True)

    def fill_plant_search(self, plantname):
        """Clicks the search icon and types plantname into the plant search."""
        self._plant_search_input.fill(plantname)

    def fill_rotation(self, rotation):
        """Fills the rotation input according to rotation."""
        self._rotation_input.fill(rotation)
        # Wait for input to be processed and saved
        self._page.wait_for_timeout(2000)

    def fill_scaling(self, scaling):
        """Fills the scaling input according to scaling."""
        self._scale_input.fill(scaling)
        # Wait for input to be processed and saved
        self._page.wait_for_timeout(2000)

    def close_tour(self):
        """
        Currently you get greeted with the tour.
        In case you rerun the tests locally or if this gets removed
        it is wrapped, so it does not fail the tests.
        The timeout is also lowered to not slow down the tests by a lot.
        """
        try:
            tour_close = self._page.get_by_label("Close Tour")
            tour_close.click(timeout=7000)
            tour_close_confirmation = self._page.get_by_role("button", name="End")
            tour_close_confirmation.click(timeout=7000)
        except PlaywrightTimeoutError:
            print("Tour was already closed")

    def click_close_selected_plant(self):
        """Closes the planting mode."""
        self._close_selected_plant.click()

    def click_search_icon(self):
        """Click the search icon that enables the search box."""
        self._plant_search_icon.click()

    def click_plant_from_search_results(self, plant_name):
        """Selects a plant by name from the search results."""
        self._page.get_by_test_id(plant_name + "-plant-search-result").click()

    def click_on_canvas_middle(self):
        """Clicks in the middle of the canvas with a 300ms delay."""
        box = self._canvas.bounding_box()
        self._page.mouse.click(
            box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        )
        self._page.wait_for_timeout(300)

    def click_delete(self):
        """Deletes a planting by clicks on the delete button."""
        self._delete_plant_button.click()

    def click_undo(self):
        """Clicks the undo button."""
        self._undo_button.click()

    def click_redo(self):
        """Clicks the redo button."""
        self._redo_button.click()

    def click_background_image(self, name):
        """
        Selects the background image by name
        and performs a short delay.
        """
        self._background_button.click()
        self._page.get_by_text(name).click()
        # Delay so image can be rendered on canvas
        self._page.wait_for_timeout(2000)

    def click_hide_base_layer(self):
        self._hide_base_layer.click()

    def click_hide_plant_layer(self):
        self._hide_plant_layer.click()
        self._page.wait_for_timeout(5000)

    def screenshot_canvas(self, timeout=300):
        """
        Takes a grayscale screenshot of the canvas.
        Has a default 300ms delay before taking the screenshot,
        to ensure everything is stable.

        Parameters
        ----------
        timeout : int, optional, default=500
        Timeout in ms before taking the screenshot.

        Returns
        -------
        opencv2 image object of the screenshot
        """
        self._page.wait_for_timeout(timeout)
        buffer = self._canvas.screenshot()
        self._screenshot = cv2.imdecode(
            np.frombuffer(buffer, dtype=np.uint8), cv2.IMREAD_GRAYSCALE
        )
        return self._screenshot

    def expect_canvas_equals_last_screenshot(self, test_name, rtol=0, atol=5):
        """
        This method compares the last taken screenshot of the canvas
        with a new one.
        Use `mpp.canvas_screenshot()` before to take a screenshot.
        If the comparison fails two .png images are saved.

        Parameters
        ----------
        test_name : str
        The name of the image files if the test fails.
        Best to pass the test name from pytests fixture `request`.
        atol : float, optional, default=5
        Absolut tolerance.
        rtol : float, optional, default=0
        Relative tolerance.

        Returns
        -------
        None

        Raises
        ------
        `AssertionError` when the two screenshots are not equal.

        Examples
        --------
        mpp.assert_canvas_equals_last_screenshot(request.node.name)
        """
        expected = self._screenshot
        actual = self.screenshot_canvas()
        try:
            np.testing.assert_allclose(expected, actual, rtol=rtol, atol=atol)
        except AssertionError as err:
            cv2.imwrite(
                "test-results/screenshots" + test_name + "-expected.png", expected
            )
            cv2.imwrite("test-results/screenshots" + test_name + "-actual.png", actual)
            raise err

    def expect_plant_on_canvas(self, plant_name):
        """
        Confirms that the plant is on the canvas,
        by clicking in the middle of the canvas
        and looking at the left side bar for a delete button.
        """
        self.click_on_canvas_middle()
        expect(self._delete_plant_button).to_be_visible()
        expect(self._page.get_by_role("heading", name=plant_name)).to_be_visible()

    def expect_no_plant_on_canvas(self):
        """
        Confirms there is no plant on the canvas,
        by clicking in the middle of the canvas
        and making sure the delete button is not visible.
        """
        self.click_on_canvas_middle()
        expect(self._delete_plant_button).not_to_be_visible()

    def expect_search_result_is_visible(self, result):
        """Confirms that a search result is visible."""
        expect(
            self._page.get_by_test_id(result + "-plant-search-result")
        ).to_be_visible()

    def expect_no_plants_found_text_is_visible(self):
        """Confirms that `no plants are found` is present."""
        expect(self._page.get_by_test_id("plant-search-results-empty")).to_be_visible()

    def expect_background_image(self, name):
        expect(self._background_select).to_have_value(name)

    def expect_rotation_to_have_value(self, val):
        """Expects that the rotation is properly set."""
        expect(self._rotation_input).to_have_value(val)

    def expect_scaling_to_have_value(self, val):
        """Expects that the scaling is properly set."""
        expect(self._scale_input).to_have_value(val)

    """NAVIGATION"""

    def to_map_management_page(self):
        """
        Clicks the button on the navbar which
        navigates to the `MapManagementPage`.
        """
        self._map_management_button.click()
        self._page.wait_for_url("**/maps")
