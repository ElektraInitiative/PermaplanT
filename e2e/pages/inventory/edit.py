from playwright.sync_api import Page
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage


class SeedEditPage(AbstractPage):
    """The seed details page of permaplant"""

    URL: str = E2E_URL + "seeds/*/edit"
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
        self._edit_button = page.get_by_role("button", name="Edit seed")

    def set_plant_name(self):
        pass

    def set_additional_name(self, name):
        self._additional_name.fill(name)

    def set_harvest_year(self):
        self._harvest_year.fill("2022")

    def set_best_by(self):
        self._best_by.fill("2023-11-22")

    def set_origin(self, origin):
        self._origin.fill(origin)

    def set_amount(self, amount: str):
        self._amount.click()
        self._page.get_by_text(amount, exact=True).click()

    def set_quality(self, quality: str):
        self._quality.click()
        self._page.get_by_text(quality, exact=True).click()

    def set_taste(self, taste: str):
        self._taste.fill(taste)

    def set_yield(self, _yield: str):
        self._yield.fill(_yield)

    def set_price(self, price: str):
        self._price.fill(price)

    def set_generation(self, generation: str):
        self._generation.fill(generation)

    def click_edit(self):
        """
        Edits seeds and navigates back to the `MapManagementPage`
        """
        self._edit_button.click()
        self._page.wait_for_url("**/seeds/")
