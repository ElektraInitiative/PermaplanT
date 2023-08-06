from abc import ABC
from e2e.pages.constants import E2E_TIMEOUT
from playwright.sync_api import Page, expect


class AbstractPage(ABC):
    URL: str
    page: Page
    TITLE: str

    def load(self) -> None:
        """Loads the pages by its URL and verifies it."""
        self.page.set_viewport_size(
            {
                "width": 1920,
                "height": 1080,
            }
        )
        self.page.set_default_timeout(E2E_TIMEOUT)
        self.page.goto(self.URL)
        self.verify()
        self.page.get_by_role("navigation").locator("svg").nth(2).click()
        # When the page is not on english, set it to english.
        if self.page.get_by_text("English", exact=True).is_visible():
            self.page.get_by_text("English", exact=True).click()

    def verify(self):
        """Verifies if the correct page is active by its page title."""
        expect(self.page).to_have_title(self.TITLE, timeout=E2E_TIMEOUT)

    def expect_alert_is_visible(self):
        """Checks if an alert is visible."""
        expect(self.page.get_by_role("alert")).to_be_visible(timeout=E2E_TIMEOUT)

    def expect_alert_is_hidden(self):
        """Checks if an alert is not invisible."""
        expect(self.page.get_by_role("alert")).to_be_hidden(timeout=E2E_TIMEOUT)

    def close_alert(self):
        """Closes the alert."""
        self.page.get_by_label("close").click()
