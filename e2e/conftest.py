import os
import pytest
from playwright.sync_api import Page
from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from e2e.pages.maps.management import MapManagementPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.edit import MapEditPage
from e2e.pages.maps.planting import MapPlantingPage


"""
Commonly used workflows and util
"""


def worker_id():
    """
    When executing tests in parallel, for example with
    `pytest -n auto`, each worker has an id that can be
    used in tests. If executed with one core the id is
    an empty string.
    """
    worker_id = ""
    if "PYTEST_XDIST_WORKER" in os.environ:
        # Get the value of the environment variable
        worker_id = os.environ["PYTEST_XDIST_WORKER"]
    return worker_id


def login(hp: HomePage, lp: LoginPage) -> HomePage:
    """
    Login to permaplant and close the login notification.
    Returns a homepage object
    """
    hp.load()
    hp.login_button_is_visible()
    hp.click_login_button()
    lp.fill_username()
    lp.fill_password()
    lp.click_sign_in()
    hp.verify()
    hp.close_alert()
    return hp


"""
Global page objects pytest fixtures
"""


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


@pytest.fixture
def mpp(page: Page) -> MapPlantingPage:
    return MapPlantingPage(page)
