from playwright.sync_api import Page, expect
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage
from e2e.pages.seeds.create import SeedCreatePage
from e2e.pages.seeds.edit import SeedEditPage


class SeedManagementPage(AbstractPage):
    """The seed management page of permaplant"""

    URL: str = E2E_URL + "/seeds"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self._page = page
        self._new_entry_button = page.get_by_role("button", name="New Entry")
        self._search_field = page.get_by_test_id("search-input__input-field")

    def search(self, input):
        self._search_field.fill(input)

    def delete_seed(self, seed_name):
        self._page.get_by_role("row", name=seed_name).get_by_test_id(
            "delete-seed-button"
        ).click()

    def archive_first_seed(self):
        """Archive the seed in the first row of the seeds table"""
        self._page.get_by_test_id("seed-overview-list__archive-button").first.click()

    def to_seed_create_page(self) -> SeedCreatePage:
        """Navigates to `SeedCreatePage`"""
        self._new_entry_button.click()
        self._page.wait_for_url("**/seeds/new")
        return SeedCreatePage(self._page)

    def to_seed_edit_page(self, seed_name) -> SeedEditPage:
        """Navigates to `SeedEditPage`"""
        self._page.get_by_role("row", name=seed_name).get_by_test_id(
            "seed-overview-list__edit-button"
        ).click()
        self._page.wait_for_url("**/seeds/*/edit")
        return SeedEditPage(self._page)

    def expect_first_row_cell_exists(self, cell_value):
        """Expects a cell to exist on the seed management page in the first row of the table"""
        expect(
            self._page.get_by_role("cell", name=cell_value, exact=True).first
        ).to_be_visible()
