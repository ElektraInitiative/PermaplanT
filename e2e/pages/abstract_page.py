import re
from abc import ABC
from e2e.pages.constants import E2E_TIMEOUT
from playwright.sync_api import Page, expect


class AbstractPage(ABC):
    URL: str
    TITLE: str
    PAGE_WIDTH: int = 1920
    PAGE_HEIGHT: int = 1080
    _page: Page

    def load(self) -> None:
        """
        Loads the page by its URL, verifies it and selects the english translation.
        """
        self._page.set_viewport_size(
            {
                "width": self.PAGE_WIDTH,
                "height": self.PAGE_HEIGHT,
            }
        )
        self.dont_load_images_except_birdie()
        self._page.set_default_timeout(timeout=E2E_TIMEOUT)
        expect.set_options(timeout=E2E_TIMEOUT)
        response = self._page.goto(self.URL)
        assert response.status == 200
        self._page.wait_for_timeout(1000)
        self.verify()
        self.switch_language_to_english_if_its_german()

    def dont_load_images_except_birdie(self):
        """
        Ignore all png/jpg images on all pages except Birdie.jpg.
        """
        self._page.route(
            re.compile(r"^(?!.*Birdie\.jpg$).*\.(jpg|png)$"),
            lambda route: route.fulfill(
                status=404, content_type="text/plain", body="Not Found!"
            ),
        )

    def switch_language_to_english_if_its_german(self):
        """Change the pages language to english, when its set to german"""
        if self._page.get_by_test_id("language-switcher__de").is_visible():
            self._page.get_by_test_id("language-switcher__de").click()
            self._page.get_by_text("English", exact=True).click()

    def verify(self):
        """Verifies if the correct page is active by its page title."""
        # Wait for navigation to complete
        expect(self._page).to_have_title(self.TITLE)
        expect(self._page).to_have_url(re.compile(".*" + self.URL))

    def expect_alert_is_visible(self):
        """Checks if an alert is visible."""
        expect(self._page.get_by_role("alert")).to_be_visible()

    def expect_alert_is_hidden(self):
        """Checks if an alert is not invisible."""
        expect(self._page.get_by_role("alert")).to_be_hidden()

    def close_alert(self):
        """Closes the alert."""
        self._page.get_by_label("close").click()
