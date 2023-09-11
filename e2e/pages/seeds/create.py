import re
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
        self._plant_name = page.get_by_test_id("plant_name")
        self._additional_name = page.get_by_test_id("additional_name")
        self._harvest_year = page.get_by_test_id("harvest_year")
        self._amount = page.get_by_test_id("amount")
        self._best_by = page.get_by_test_id("best_by")
        self._origin = page.get_by_test_id("origin")
        self._quality = page.get_by_test_id("quality")
        self._taste = page.get_by_test_id("taste")
        self._yield = page.get_by_test_id("yield")
        self._price = page.get_by_test_id("price")
        self._generation = page.get_by_test_id("generation")
        self._notes = page.get_by_test_id("notest")

    def create_a_seed(self):
        """
        Helper function to create a seed
        Fills out fields and clicks create at the end
        which navigate to the `SeedManagementPage`
        """
        # Plant Name TODO use better locator
        self._page.get_by_role("main").locator("svg").first.click().click()
        self._page.get_by_text("Abelia triflora (indian abelia)", exact=True).click()

        # Amount TODO use better locator
        self._amount.click()
        self._page.locator("#react-select-9-option-2").click()

        self._additional_name.fill("SUT")
        self._origin.fill("System under Test")
        self._taste.fill("System Under Test")

        # TODO fill out all fields

        self.click_create()

    def click_create(self):
        """
        Clicks create at the end
        which navigate to the `MapManagementPage`
        """
        self._create_button.click()
        self._page.wait_for_url("**/seeds")
