from pytest_bdd import scenarios, when, then

from e2e.pages.maps.planting import MapPlantingPage


scenarios("features/planting_select.feature")


# Scenario: Successfully selecting plants

# There is currently no real way to confirm
# how many plants you have selected with the
# select box, so this test only confirms that
# the plant name on the bottom left panel is visible


@when("I drag a select box over the canvas")
def drag_select_box(mpp: MapPlantingPage):
    mpp.drag_select_box_over_canvas()


@then("the plant is selected")
def plant_is_selected(mpp: MapPlantingPage):
    mpp.expect_plant_on_canvas("Tomato (Solanum lycopersicum)")
