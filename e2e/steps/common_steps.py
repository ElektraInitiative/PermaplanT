"""
Frequently used steps in other tests
"""

from pytest_bdd import given, when, parsers

from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.management import MapManagementPage
from e2e.pages.maps.planting import MapPlantingPage


@given(
    parsers.parse(
        "I am on the {mapname} map page and I have selected the {layer} layer"
    )
)
def on_a_map_page_with_layer(
    hp: HomePage,
    lp: LoginPage,
    mmp: MapManagementPage,
    mcp: MapCreatePage,
    mpp: MapPlantingPage,
    mapname,
    layer,
    worker_id,
):
    """
    Login -> create a map -> enter the map -> close tour ->
    enable plant layer.

    Returns:
    -------
    `MapPlantingPage` object
    """
    login(hp, lp)
    hp.to_map_management_page()
    mmp.verify()
    mmp.to_map_create_page()
    mcp.create_a_map(mapname + worker_id)
    mmp.to_map_planting_page(mapname + worker_id)
    mpp.verify()
    mpp.close_tour()
    if layer == "plant":
        mpp.check_plant_layer()
    elif layer == "base":
        mpp.check_base_layer()
    else:
        raise ValueError("Invalid Layer")
    return mpp


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
    lp.verify()
    lp.fill_username()
    lp.fill_password()
    lp.click_sign_in()
    hp.verify()
    hp.close_alert()
    return hp


@when("I place a tomato on the canvas")
@when("I plant something")
def plant_a_tomato(mpp: MapPlantingPage) -> MapPlantingPage:
    """
    Plant a tomato on the `MapPlantingPage`
    and verify it is planted.
    """
    mpp.click_search_icon()
    mpp.fill_plant_search("tomato")
    mpp.click_plant_from_search_results("tomato Solanum lycopersicum")
    mpp.click_on_canvas_middle()
    mpp.click_close_selected_plant()
    return mpp


@when(parsers.parse("I select a background image"))
def select_background_image(mpp: MapPlantingPage):
    mpp.select_birdie_background()
