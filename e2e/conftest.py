import pytest
from .pages.home import HomePage
from .pages.login import LoginPage
from playwright.sync_api import Page


@pytest.fixture
def hp(page: Page) -> HomePage:
    return HomePage(page)


@pytest.fixture
def lp(page: Page) -> LoginPage:
    return LoginPage(page)
