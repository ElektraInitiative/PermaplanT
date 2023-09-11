
from playwright.sync_api import Page
from e2e.pages.constants import E2E_URL
from e2e.pages.abstract_page import AbstractPage


class SeedEditPage(AbstractPage):
    """The seed details page of permaplant"""

    URL: str = E2E_URL + "seeds/*/edit"
    TITLE: str = "PermaplanT"

    def __init__(self, page: Page):
        self._page = page

    def expect_additional_name(self):
        # TODO
        pass

    def expect_plant_name(self):
        # TODO
        pass

    def expect_origin(self):
        # TODO
        pass

    def expect_taste(self):
        # TODO
        pass

    def expect_price(self):
        # TODO
        pass

    def expect_generation(self):
        # TODO
        pass
