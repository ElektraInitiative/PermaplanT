from pytest_bdd import scenarios, given, when, then

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


@given("I have an empty canvas before")
def canvas_is_empty(mpp: MapPlantingPage):
    mpp.screenshot_canvas()


@when("I turn the base layer visiblity off")
def turn_base_layer_invisibility_off(mpp: MapPlantingPage):
    mpp.click_hide_base_layer()


@then(("the base layer is invisible"))
def base_layer_is_invisible(mpp: MapPlantingPage, request):
    mpp.expect_canvas_equals_last_screenshot(request.node.name)
