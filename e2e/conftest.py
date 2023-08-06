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

"""The number of retries"""


def worker_id():
    """
    Returns the worker_id as string
    The workerid is given by pytest-xdist. Defaults to "" when not parallel.
    """
    worker_id = ""

    if "PYTEST_XDIST_WORKER" in os.environ:
        # Get the value of the environment variable
        worker_id += "-" + os.environ["PYTEST_XDIST_WORKER"]

    return worker_id


def login(hp: HomePage, lp: LoginPage) -> HomePage:
    """
    Login to permaplant and close the login notification.

    Returns:
    -------
    `HomePage` object
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


def prepare_planting(
    hp: HomePage,
    lp: LoginPage,
    mmp: MapManagementPage,
    mcp: MapCreatePage,
    mpp: MapPlantingPage,
    mapname: str,
) -> MapPlantingPage:
    """
    Login -> create a map -> enter the map -> close tour ->
    enable plant layer.

    Returns:
    -------
    `MapPlantingPage` object
    """
    login(hp, lp)
    hp.to_map_management_page()
    mmp.to_map_create_page()
    mcp.create_a_map(mapname)
    mmp.to_map_planting_page(mapname)
    mpp.verify()
    mpp.close_tour()
    mpp.check_plant_layer()
    return mpp


def plant_a_tomato(mpp: MapPlantingPage) -> MapPlantingPage:
    """
    Plant a tomato on the `MapPlantingPage`
    and verify it is planted.
    """
    mpp.click_search_icon()
    mpp.fill_plant_search("tomato")
    mpp.click_plant_from_search_results("tomato Solanum lycopersicum")
    mpp.click_on_canvas()
    # Click a second time to select the plant.
    mpp.click_on_canvas()
    mpp.expect_plant_to_be_planted("Tomato (Solanum lycopersicum)")
    return mpp


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
