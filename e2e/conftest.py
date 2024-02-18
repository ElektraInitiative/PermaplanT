import uuid
import pytest
from dotenv import load_dotenv
from playwright.sync_api import Page
from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from e2e.pages.maps.management import MapManagementPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.edit import MapEditPage
from e2e.pages.maps.planting import MapPlantingPage

# imported so they are interpreted before the tests
from steps.common_steps import *  # noqa: F401 F403


load_dotenv()


@pytest.fixture
def worker_uuid(worker_id):
    return "-" + worker_id + "-" + str(uuid.uuid4())


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
