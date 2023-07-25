from abc import ABC
from playwright.sync_api import expect


class AbstractPage(ABC):
    def verify(self):
        expect(self.page).to_have_title(self.TITLE)

    def load(self) -> None:
        self.page.goto(self.URL)
        self.page.get_by_role("navigation").locator("svg").nth(2).click()
        self.page.get_by_text("English", exact=True).click()
