from e2e.pages.maps.planting import MapPlantingPage
from pytest_bdd import scenarios, when, then, parsers


scenarios("features/timeline.feature")

# Mixed scenarios: These test functions are mixed up a bit.
# Since the scenarios reuse many functions from each other.
# I decided to order them starting with WHENS and THENS afterwards.


# WHEN
@when("I change the map date to yesterday")
def change_map_date_to_yesterday(mpp: MapPlantingPage):
    mpp.change_map_date_by_days(-1)


@when("I change the map date to tomorrow")
def change_map_date_to_tomorrow(mpp: MapPlantingPage):
    mpp.change_map_date_by_days(1)


@when("I change the map date to last year")
def change_map_date_to_last_year(mpp: MapPlantingPage):
    mpp.change_map_date_by_years(-1)


@when("I change the map date next year")
def change_map_date_to_next_year(mpp: MapPlantingPage):
    mpp.change_map_date_by_years(1)


@when("I change the plants added date to tomorrow")
def change_plants_added_date_to_tomorrow(mpp: MapPlantingPage):
    mpp.click_on_canvas_middle()
    mpp.change_plant_added_date_by_days(1)


@when("I change the plants removed date to yesterday")
def change_plants_removed_date_to_yesterday(mpp: MapPlantingPage):
    # Change added date also, otherwise we cant change removed date.
    mpp.click_on_canvas_middle()
    mpp.change_plant_added_date_by_days(-2)
    mpp.change_plant_removed_date_by_days(-1)


@when("I change the plants added date to yesterday")
def change_plants_added_date_to_yesterday(mpp: MapPlantingPage):
    mpp.click_on_canvas_middle()
    mpp.change_plant_added_date_by_days(-1)


@when("I change the plants removed date to tomorrow")
def change_plants_removed_date_to_tomorrow(mpp: MapPlantingPage):
    mpp.click_on_canvas_middle()
    mpp.change_plant_removed_date_by_days(1)


# THEN


@then(parsers.parse("the plant disappears"))
def plant_is_hidden(mpp: MapPlantingPage):
    mpp.expect_no_plant_on_canvas()


@then(parsers.parse("the plant appears"))
def plant_appears(mpp: MapPlantingPage):
    mpp.expect_plant_on_canvas("Tomato (Solanum lycopersicum)")
