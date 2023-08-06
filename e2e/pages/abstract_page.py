import re
from abc import ABC
from e2e.pages.constants import E2E_TIMEOUT
from playwright.sync_api import Page, expect


class AbstractPage(ABC):
    URL: str
    page: Page
    TITLE: str
    PAGE_WIDTH: int = 1920
    PAGE_HEIGHT: int = 1080

    def load(self) -> None:
        """
        Loads the page by its URL, verifies it and selects the english translation.
        """
        self.page.set_viewport_size(
            {
                "width": self.PAGE_WIDTH,
                "height": self.PAGE_HEIGHT,
            }
        )
        self.dont_load_images()
        self.page.set_default_timeout(timeout=E2E_TIMEOUT)
        response = self.page.goto(self.URL)
        assert response.status == 200
        self.page.wait_for_timeout(1000)
        self.verify()
        self.click_english_translation()

    def dont_load_images(self):
        """
        Ignore all png/jpg images on all pages.
        """
        self.page.route(
            re.compile(r"\.(jpg|png)$"),
            lambda route: route.fulfill(
                status=404, content_type="text/plain", body="Not Found!"
            ),
        )

    def click_english_translation(self):
        """When the page is not on english, set it to english"""
        if self.page.get_by_text("English", exact=True).is_visible():
            self.page.get_by_text("English", exact=True).click()

    def verify(self):
        """Verifies if the correct page is active by its page title."""
        # Wait for navigation to complete
        expect(self.page).to_have_title(self.TITLE)
        expect(self.page).to_have_url(re.compile(".*" + self.URL))

    def expect_alert_is_visible(self):
        """Checks if an alert is visible."""
        expect(self.page.get_by_role("alert")).to_be_visible()

    def expect_alert_is_hidden(self):
        """Checks if an alert is not invisible."""
        expect(self.page.get_by_role("alert")).to_be_hidden()

    def close_alert(self):
        """Closes the alert."""
        self.page.get_by_label("close").click()
