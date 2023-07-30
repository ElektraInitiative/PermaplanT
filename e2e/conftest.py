import pytest
import os
from .pages.home import HomePage
from .pages.login import LoginPage
from .pages.maps.management import MapManagementPage
from .pages.maps.create import MapCreatePage
from .pages.maps.edit import MapEditPage
from .pages.maps.planting import MapPlantingPage
from playwright.sync_api import Page

# When executing tests in parallel there is a worker id
# that will be used to mark entities with the worker id
# pytest -n auto for example is a parallel execution
worker_id = ""
if "PYTEST_XDIST_WORKER" in os.environ:
    # Get the value of the environment variable
    worker_id = os.environ["PYTEST_XDIST_WORKER"]

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
