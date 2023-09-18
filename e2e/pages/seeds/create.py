from playwright.sync_api import Page
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage


class SeedCreatePage(AbstractPage):
    """The seed creation page of permaplant"""

    URL: str = E2E_URL + "seeds/new"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self._page = page
        self._name = page.get_by_placeholder("Name *")
        self._create_button = page.get_by_role("button", name="Create Seed")
        self._plant_name = page.get_by_test_id("seed-form-plant_name")
        self._additional_name = page.get_by_test_id("seed-form-additional_name")
        self._harvest_year = page.get_by_test_id("seed-form-harvest_year")
        self._amount = page.get_by_test_id("seed-form-amount")
        self._best_by = page.get_by_test_id("seed-form-best_by")
        self._origin = page.get_by_test_id("seed-form-origin")
        self._quality = page.get_by_test_id("seed-form-quality")
        self._taste = page.get_by_test_id("seed-form-taste")
        self._yield = page.get_by_test_id("seed-form-yield")
        self._price = page.get_by_test_id("seed-form-price")
        self._generation = page.get_by_test_id("seed-form-generation")
        self._notes = page.get_by_test_id("seed-form-notest")

    def create_a_seed(self, plant_name, amount, additional_name, origin, taste):
        """
        Helper function to create a seed
        Fills out fields and clicks create at the end
        which navigate to the `SeedManagementPage`
        """
        self._page.get_by_text("Plant Name *Tomato").click()
        self._page.get_by_text(plant_name, exact=True).click()

        # Amount TODO use better locator
        self._page.get_by_text("Amount *More than enough").click()
        self._page.get_by_text(amount, exact=True).click()

        self._additional_name.fill(additional_name)
        self._origin.fill(origin)
        self._taste.fill(taste)

        # TODO fill out all fields

        self.click_create()

    def click_create(self):
        """
        Clicks create at the end
        which navigate to the `MapManagementPage`
        """
        self._create_button.click()
        self._page.wait_for_url("**/seeds")
