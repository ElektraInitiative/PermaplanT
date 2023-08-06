from e2e.conftest import prepare_planting, worker_id
from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.planting import MapPlantingPage
from e2e.pages.maps.management import MapManagementPage
from pytest_bdd import scenarios, given, when, then, parsers


scenarios("features/planting.feature")


@given(parsers.parse("I am on the {name} map page and I have selected the plant layer"))
def on_planting_screen(
    hp: HomePage,
    lp: LoginPage,
    mmp: MapManagementPage,
    mcp: MapCreatePage,
    mpp: MapPlantingPage,
    name,
):
    prepare_planting(hp, lp, mmp, mcp, mpp, name + worker_id())


# Scenario 1: Plant something on the map


@when("I place a plant on the canvas")
def plant_something(mpp: MapPlantingPage):
    mpp.click_search_icon()
    mpp.fill_plant_search("tomato")
    mpp.click_plant_from_search_results("tomato Solanum lycopersicum")
    mpp.click_on_canvas()
    # Click a second time to leave the placing mode and select the plant.
    mpp.click_on_canvas()
    mpp.expect_plant_to_be_planted("Tomato (Solanum lycopersicum)")


@then(
    parsers.parse("it stays on {name} even when I leave the page and come back later")
)
def planting_persists(mmp: MapManagementPage, mpp: MapPlantingPage, name):
    mpp.to_map_management_page()
    mmp.to_map_planting_page(name + worker_id())
    mpp.check_plant_layer()
    mpp.click_on_canvas()
    mpp.expect_plant_to_be_planted("Tomato (Solanum lycopersicum)")
