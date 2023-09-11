
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
        self._create_button = page.get_by_role("button", name="New Entry")

    def delete_seed(self, seed_name):
        self._page.get_by_role("row", name=seed_name).get_by_test_id("delete-seed-button").click()

    def to_seed_create_page(self) -> SeedCreatePage:
        """Navigates to `SeedCreatePage`"""
        self._create_button.click()
        self._page.wait_for_url("**/seeds/new")
        return SeedCreatePage(self._page)

    def to_seed_edit_page(self, seed_name) -> SeedEditPage:
        """Navigates to `SeedEditPage`"""
        self._page.get_by_role("row", name=seed_name).get_by_test_id("edit-seed-button").click()
        self._page.wait_for_url("**/seeds/*/edit")
        return SeedEditPage(self._page)

    def expect_seed_exists(self, seedname):
        """Expects a seed to exist on the seed management page by looking for its additional name"""
        expect(self._page.get_by_role("rowheader", name=seedname)).to_be_visible()
