from pytest_bdd import scenarios, when, then

from e2e.pages.maps.planting import MapPlantingPage


scenarios("features/layer_visibility.feature")


# Scenario 1: Successfully change base layer visibility


@when("I turn the plant layer visibility off")
def turn_plant_layer_visibility_off(mpp: MapPlantingPage):
    mpp.click_hide_plant_layer()


@then(("all plants are invisible"))
def plants_are_invisible(mpp: MapPlantingPage):
    mpp.expect_no_plant_on_canvas()


# Scenario 2: Successfully change base layer visibility


@when("I turn the base layer visiblity off")
def turn_base_layer_invisibility_off(mpp: MapPlantingPage):
    mpp.click_hide_base_layer()
