from abc import ABC
from playwright.sync_api import expect


class AbstractPage(ABC):
    def load(self) -> None:
        """Loads the pages by its URL and verifies it."""
        self.page.goto(self.URL)
        self.verify()
        self.page.get_by_role("navigation").locator("svg").nth(2).click()
        # When the page is not on english, set it to english.
        if self.page.get_by_text("English", exact=True).is_visible():
            self.page.get_by_text("English", exact=True).click()

    def verify(self):
        """Verifies if the correct page is active by its page title."""
        expect(self.page).to_have_title(self.TITLE)

    def alert_is_visible(self):
        """Checks if an alert is visible."""
        expect(self.page.get_by_role("alert")).to_be_visible()

    def alert_is_hidden(self):
        """Checks if an alert is not invisible."""
        expect(self.page.get_by_role("alert")).to_be_hidden()

    def close_alert(self):
        """Closes the alert."""
        self.page.get_by_label("close").click()
