from e2e.conftest import prepare_planting, worker_id
from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.planting import MapPlantingPage
from e2e.pages.maps.management import MapManagementPage
from pytest_bdd import scenarios, given, when, then, parsers


scenarios("features/timeline.feature")


@given(parsers.parse("I am on the {name} map page and a planting is added to the map"))
def on_planting_screen(
    hp: HomePage,
    lp: LoginPage,
    mmp: MapManagementPage,
    mcp: MapCreatePage,
    mpp: MapPlantingPage,
    name,
):
    # TODO, have rebased method here later
    prepare_planting(hp, lp, mmp, mcp, mpp, name + worker_id())
    mpp.click_search_icon()
    mpp.fill_plant_search("tomato")
    mpp.click_plant_from_search_results("tomato Solanum lycopersicum")
    mpp.click_on_canvas_middle()
    # Click a second time to leave the placing mode and select the plant.
    mpp.click_on_canvas_middle()
    mpp.expect_plant_to_be_planted("Tomato (Solanum lycopersicum)")


# Mixed scenarios: These test functions are mixed up a bit.
# Since the scenarios reuse many functions from each other.
# I decided to order them starting with WHENS and THENS afterwards.


# WHEN


@when("I change the map date to tomorrow")
def change_map_to_tomorrow(mpp: MapPlantingPage):
    mpp.change_map_date_by_days(1)


@when("I change the plants added date to tomorrow")
def change_plants_added_date_to_tomorrow(mpp: MapPlantingPage):
    mpp.change_plant_added_date_by_days(1)


@when("I change the plants removed date to yesterday")
def change_plants_removed_date_to_yesterday(mpp: MapPlantingPage):
    # Change added date also, otherwise we cant change removed date.
    mpp.change_plant_added_date_by_days(-2)
    mpp.change_plant_removed_date_by_days(-1)


@when("I change the plants added date to yesterday")
def change_plants_added_date_to_yesterday(mpp: MapPlantingPage):
    mpp.change_plant_added_date_by_days(-1)


@when("I change the plants removed date to tomorrow")
def change_plants_removed_date_to_tomorrow(mpp: MapPlantingPage):
    mpp.change_plant_removed_date_by_days(1)


# THEN


@then(parsers.parse("the plant disappears"))
def plant_is_hidden(mpp: MapPlantingPage):
    mpp.expect_plant_to_not_be_planted("Tomato (Solanum lycopersicum)")


@then(parsers.parse("the plant appears"))
def plant_appears(mpp: MapPlantingPage):
    mpp.expect_plant_to_be_planted("Tomato (Solanum lycopersicum)")
