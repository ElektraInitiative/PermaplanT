from playwright.sync_api import Page
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage


class SeedCreatePage(AbstractPage):
    """The seed creation page of permaplant"""

    URL: str = E2E_URL + "seeds/new"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self._page = page
        self._plant_name = page.get_by_test_id("paginated-select-menu__Plant Name")
        self._additional_name = page.get_by_label("Additional Name")
        self._harvest_year = page.get_by_test_id("create-seed-form__harvest_year")
        self._amount = page.get_by_test_id("select-menu__Amount-select")
        self._best_by = page.get_by_test_id("create-seed-form__best_by")
        self._origin = page.get_by_test_id("create-seed-form__origin")
        self._quality = page.get_by_test_id("select-menu__Quality-select")
        self._taste = page.get_by_test_id("create-seed-form__taste")
        self._yield = page.get_by_test_id("create-seed-form__yield")
        self._price = page.get_by_test_id("create-seed-form__price")
        self._generation = page.get_by_test_id("create-seed-form__generation")
        self._notes = page.get_by_test_id("create-seed-form__notest")
        self._create_button = page.get_by_role("button", name="Create Seed")

    def create_a_seed(self, plant_name, additional_name, amount, origin, taste):
        """
        Helper function to create a seed
        Fills out fields and clicks create at the end
        which navigate to the `SeedManagementPage`
        """
        self._plant_name.click()
        self._page.get_by_text(plant_name, exact=True).click()

        self._amount.click()
        self._page.get_by_text(amount, exact=True).click()

        # TODO, needs better locator, not working
        # self._best_by.fill("2023-10-18")

        self._additional_name.fill(additional_name)
        self._origin.fill(origin)

        self._quality.click()
        self._page.get_by_text("Organic", exact=True).click()

        self._taste.fill(taste)

        self._yield.fill("5")

        self._price.fill("22")

        self._generation.fill("11")

        self.click_create()

    def click_create(self):
        """
        Creates seeds and navigates back to the `MapManagementPage`
        """
        self._create_button.click()
        self._page.wait_for_url("**/seeds")
