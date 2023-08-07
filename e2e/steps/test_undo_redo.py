from e2e.pages.maps.planting import MapPlantingPage
from pytest_bdd import scenarios, when, then


scenarios("features/undo_redo.feature")


# Scenario 1: Successful undo


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
    mpp.click_undo()


@when("I click redo to get my plant back")
def click_redo(mpp: MapPlantingPage):
    mpp.click_redo()
    mpp.click_on_canvas_middle()


@then("I can see my plant on the canvas again")
def plant_is_back(mpp: MapPlantingPage):
    mpp.expect_plant_to_be_planted("Tomato (Solanum lycopersicum)")
