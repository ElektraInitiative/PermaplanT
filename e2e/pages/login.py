from playwright.sync_api import Page
from .abstract_page import AbstractPage


class LoginPage(AbstractPage):
    TITLE: str = 'Sign in to PermaplanT'

    def __init__(self, page: Page):
        self.page = page
        self.sign_in_button = page.get_by_role("button", name="Sign In")
        self.password_field = page.get_by_label("Password")
        self.username_field = page.get_by_label("Username or email")

    def enter_username(self, username):
        self.username_field.fill(username)

    def enter_password(self, password):
        self.password_field.fill(password)

    def click_sign_in(self):
        self.sign_in_button.click()
