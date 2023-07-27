import pytest
from .pages.home import HomePage
from .pages.login import LoginPage
from .pages.maps.management import MapManagementPage
from .pages.maps.create import MapCreatePage
from .pages.maps.edit import MapEditPage
from playwright.sync_api import Page


@pytest.fixture
def hp(page: Page) -> HomePage:
    return HomePage(page)


@pytest.fixture
def lp(page: Page) -> LoginPage:
    return LoginPage(page)


@pytest.fixture
def mmp(page: Page) -> MapManagementPage:
    return MapManagementPage(page)


@pytest.fixture
def mcp(page: Page) -> MapCreatePage:
    return MapCreatePage(page)


@pytest.fixture
def mep(page: Page) -> MapEditPage:
    return MapEditPage(page)
