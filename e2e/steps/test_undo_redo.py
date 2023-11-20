from e2e.pages.maps.planting import MapPlantingPage
from pytest_bdd import scenarios, when, then


scenarios("features/undo_redo.feature")


# Scenario: Successful undo


@when("I click undo")
def click_undo(mpp: MapPlantingPage):
    mpp.click_undo()


@then("my plant is gone")
def plant_is_gone(mpp: MapPlantingPage):
    mpp.expect_no_plant_on_canvas()


# Scenario: Successful redo


@when("I accidentally clicked undo after planting one plant")
def accidental_undo(mpp: MapPlantingPage):
    mpp.click_undo()


@when("I click redo")
def click_redo(mpp: MapPlantingPage):
    mpp.click_redo()


@then("I can see my plant on the canvas again")
def plant_is_back(mpp: MapPlantingPage):
    # Click on top left to reset selection
    mpp.click_on_canvas_top_left()
    mpp.expect_plant_on_canvas("Tomato (Solanum lycopersicum)")


# Scenario: Successful undo delete


@when("I delete the plant")
def delete_plant(mpp: MapPlantingPage):
    mpp.click_on_canvas_middle()
    mpp.click_delete()
