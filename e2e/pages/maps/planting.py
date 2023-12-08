import cv2
import time
import numpy as np
from datetime import datetime, timedelta
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
        self._added_date_state_idle = page.get_by_test_id(
            "planting-attribute-edit-form__add-date-idle"
        )
        self._removed_on_state_idle = page.get_by_test_id(
            "planting-attribute-edit-form__removed-on-idle"
        )
        self._delete_plant_button = page.get_by_role("button", name="Delete Planting")

        # Layer visibility
        self._hide_plant_layer = page.get_by_test_id(
            "layer-list-item__plants-layer-visibility-icon"
        )
        self._hide_base_layer = page.get_by_test_id(
            "layer-list-item__base-layer-visibility-icon"
        )

        # Canvas
        self._canvas = page.get_by_test_id("base-stage__canvas")
        self._close_selected_plant = self._canvas.get_by_role("button")

        # Timeline
        self._timeline_day_slider = page.get_by_test_id("timeline__day-slider")
        self._timeline_month_slider = page.get_by_test_id("timeline__month-slider")
        self._timeline_year_slider = page.get_by_test_id("timeline__year-slider")
        self._timeline_idle = page.get_by_test_id("timeline__state-idle")

        # Top left section
        self._undo_button = page.get_by_test_id("map__undo-button")
        self._redo_button = page.get_by_test_id("map__redo-button")

        # Selected plant section
        self._plant_added_date = page.get_by_label("Added on")
        self._plant_removed_date = page.get_by_label("Removed on")

        # Plant layer
        self._base_layer_radio = page.get_by_test_id(
            "layer-list-item__base-layer-radio"
        )
        self._plant_layer_radio = page.get_by_test_id(
            "layer-list-item__plants-layer-radio"
        )
        self._plant_search_icon = page.get_by_test_id("plant-search__icon-button")
        self._plant_search_input = page.get_by_test_id("plant-search__search-input")

        # Base layer
        self._background_image_file_path = page.get_by_test_id(
            "base-layer-right-toolbar__background-input"
        )
        self._background_image_file_path_idle = page.get_by_test_id(
            "base-layer-attribute-edit-form__background-image-file-path-idle"
        )
        self._background_button = page.get_by_role("button", name="Choose an image")
        self._rotation_input = page.get_by_test_id(
            "base-layer-right-toolbar__rotation-input"
        )
        self._rotation_input_idle = page.get_by_test_id(
            "base-layer-attribute-edit-form__rotation-idle"
        )
        self._scale_input = page.get_by_test_id("base-layer-right-toolbar__scale-input")
        self._scale_input_idle = page.get_by_test_id(
            "base-layer-attribute-edit-form__scale-idle"
        )

    """ACTIONS"""

    def check_base_layer(self):
        """Checks the base layer radio button."""
        self._base_layer_radio.set_checked(True)

    def check_plant_layer(self):
        """Ckecks the plant layer radio button."""
        self._plant_layer_radio.set_checked(True)

    def change_map_date_by_days(self, delta_days: int):
        """Changes the date by a given amount of days."""
        if delta_days > 0:
            for i in range(delta_days):
                self._timeline_day_slider.press("ArrowRight")
        else:
            for i in range(abs(delta_days)):
                self._timeline_day_slider.press("ArrowLeft")
        self._timeline_idle.wait_for()

    def change_map_date_by_months(self, delta_months: int):
        """Changes the date by a given amount of months."""
        if delta_months > 0:
            for i in range(delta_months):
                self._timeline_month_slider.press("ArrowRight")
        else:
            for i in range(abs(delta_months)):
                self._timeline_month_slider.press("ArrowLeft")

    def change_map_date_by_years(self, delta_years: int):
        """Changes the date by a given amount of years."""
        if delta_years > 0:
            for i in range(delta_years):
                self._timeline_year_slider.press("ArrowRight")
        else:
            for i in range(abs(delta_years)):
                self._timeline_year_slider.press("ArrowLeft")

    def change_plant_added_date_by_days(self, delta_days: int):
        """Changes the date by a given amount of days and checks the spinner if possible."""
        day = datetime.today() + timedelta(days=delta_days)
        self._plant_added_date.fill(day.strftime("%Y-%m-%d"))
        if delta_days < 0:
            self._added_date_state_idle.wait_for()

    def change_plant_removed_date_by_days(self, delta_days: int):
        """Changes the date by a given amount of days  and checks the spinner if possible."""
        day = datetime.today() + timedelta(days=delta_days)
        self._plant_removed_date.fill(day.strftime("%Y-%m-%d"))
        if delta_days > 0:
            self._removed_on_state_idle.wait_for()

    def fill_plant_search(self, plantname):
        """Clicks the search icon and types plantname into the plant search."""
        self._plant_search_input.fill(plantname)

    def fill_rotation(self, rotation):
        """Fills the rotation input according to rotation."""
        self._rotation_input.fill(rotation)
        self._rotation_input_idle.wait_for()

    def fill_scaling(self, scaling):
        """Fills the scaling input according to scaling."""
        self._scale_input.fill(scaling)
        self._scale_input_idle.wait_for()

    def close_tour(self):
        """
        Closes the tour window and catches the exception if the tour window does not exist.
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
        self._page.get_by_test_id("plant-list-item__" + plant_name).click()

    def click_on_canvas_middle(self):
        """Clicks in the middle of the canvas with a 300ms delay."""
        time.sleep(1)
        box = self._canvas.bounding_box()
        self._page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        self._page.mouse.click(
            box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        )

    def drag_select_box_over_canvas(self):
        """Drags a select box over 75% of the canvas from top left to bottom right"""
        time.sleep(1)
        box = self._canvas.bounding_box()
        x = box["x"]
        y = box["y"]
        width = box["width"]
        height = box["height"]
        self._page.mouse.move(x + width / 4, y + height / 4)
        self._page.mouse.down()
        self._page.mouse.move(x + (width / 4) * 3, y + (height / 4) * 3)
        # https://playwright.dev/docs/input#drag-and-drop:~:text=()%3B-,NOTE,-If%20your%20page
        # I dont know why, but it works only with a second mouse.move()
        self._page.mouse.move(x + (width / 4) * 3, y + (height / 4) * 3)
        self._page.mouse.up()

    def click_on_canvas_top_left(self):
        """Clicks on the top left area of the canvas."""
        box = self._canvas.bounding_box()
        self._page.mouse.click(
            box["x"] + box["width"] / 4, box["y"] + box["height"] / 4
        )

    def click_delete(self):
        """Deletes a planting by clicks on the delete button."""
        self._delete_plant_button.click()

    def click_undo(self):
        """Clicks the undo button."""
        self._undo_button.click()

    def click_redo(self):
        """Clicks the redo button."""
        self._redo_button.click()

    def select_birdie_background(self):
        """
        Selects the Birdie.jpg background image
        since its the only image allowed to load (see `dont_load_images()`).
        Performs a short delay.
        """
        self._background_button.click()
        self._page.get_by_text("Birdie.jpg").click()
        self._background_image_file_path_idle.wait_for()

    def click_hide_base_layer(self):
        self._hide_base_layer.click()

    def click_hide_plant_layer(self):
        self._hide_plant_layer.click()

    def screenshot_canvas(self, timeout=3):
        """
        Takes a grayscale screenshot of the canvas.
        Has a default 300ms delay before taking the screenshot,
        to ensure everything is stable.

        Parameters
        ----------
        timeout : int, optional, default=3 in seconds
        Timeout in ms before taking the screenshot.

        Returns
        -------
        opencv2 image object of the screenshot
        """
        time.sleep(timeout)
        buffer = self._canvas.screenshot()
        self._screenshot = cv2.imdecode(
            np.frombuffer(buffer, dtype=np.uint8), cv2.IMREAD_GRAYSCALE
        )
        return self._screenshot

    """ASSERTIONS"""

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
        expect(self._page.get_by_test_id("plant-list-item__" + result)).to_be_visible()

    def expect_no_plants_found_text_is_visible(self):
        """Confirms that `no plants are found` is present."""
        expect(self._page.get_by_test_id("plant-search__empty-results")).to_be_visible()

    def expect_background_image(self, name):
        expect(self._background_image_file_path).to_have_value(name)

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
