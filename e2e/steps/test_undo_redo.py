from e2e.conftest import to_planting_page, plant_a_tomato, worker_id
from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.planting import MapPlantingPage
from e2e.pages.maps.management import MapManagementPage
from pytest_bdd import scenarios, given, when, then, parsers


scenarios("features/undo_redo.feature")


@given(parsers.parse("I am on the {name} map page and I have selected the plant layer"))
def on_planting_screen(
    hp: HomePage,
    lp: LoginPage,
    mmp: MapManagementPage,
    mcp: MapCreatePage,
    mpp: MapPlantingPage,
    name,
):
    to_planting_page(hp, lp, mmp, mcp, mpp, name + worker_id())
    mpp.check_plant_layer()


# Scenario 1: Successful undo


@when("I plant something")
def plant_something(mpp: MapPlantingPage):
    plant_a_tomato(mpp)


@when("I click undo")
def click_undo(mpp: MapPlantingPage):
    mpp.click_undo()


@then("my plant is gone")
def plant_is_gone(mpp: MapPlantingPage):
    mpp.click_on_canvas_middle()
    mpp.expect_plant_to_not_be_planted("Tomato (Solanum lycopersicum)")


# Scenario 2: Successful redo


@when("I accidentally clicked undo after planting one plant")
def accidental_undo(mpp: MapPlantingPage):
    plant_a_tomato(mpp)
    mpp.click_undo()


@when("I click redo to get my plant back")
def click_redo(mpp: MapPlantingPage):
    mpp.click_redo()
    mpp.click_on_canvas_middle()


@then("I can see my plant on the canvas again")
def plant_is_back(mpp: MapPlantingPage):
    mpp.expect_plant_to_be_planted("Tomato (Solanum lycopersicum)")
