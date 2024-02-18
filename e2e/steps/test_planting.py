from e2e.pages.maps.planting import MapPlantingPage
from e2e.pages.maps.management import MapManagementPage
from pytest_bdd import scenarios, then, parsers


scenarios("features/planting.feature")


# Scenario 1: Plant something on the map


@then(
    parsers.parse("it stays on {name} even when I leave the page and come back later")
)
def planting_persists(mmp: MapManagementPage, mpp: MapPlantingPage, name, worker_uuid):
    mpp.to_map_management_page()
    mmp.to_map_planting_page(name + worker_uuid)
    mpp.check_plant_layer()
    mpp.expect_plant_on_canvas("Tomato (Solanum lycopersicum)")
