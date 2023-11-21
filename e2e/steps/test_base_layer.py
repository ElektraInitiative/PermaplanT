from e2e.pages.maps.planting import MapPlantingPage
from e2e.pages.maps.management import MapManagementPage
from pytest_bdd import scenarios, when, then, parsers

scenarios("features/base_layer.feature")


# Scenario 1: Successfully select a background image


@then(
    parsers.parse("{image_name} stays even when I leave {map_name} and come back later")
)
def background_image_stays(
    mpp: MapPlantingPage, mmp: MapManagementPage, image_name, map_name, worker_uuid
):
    mpp.to_map_management_page()
    mmp.verify()
    mmp.to_map_planting_page(map_name + worker_uuid)
    mpp.check_base_layer()
    mpp.expect_background_image(image_name)


# Scenario 2: Successfully rotate the background image


@when(parsers.parse("I change the rotation of the image to {val} degrees"))
def change_rotation(mpp: MapPlantingPage, val):
    mpp.select_birdie_background()
    mpp.expect_background_image("/Photos/Birdie.jpg")
    mpp.check_base_layer()
    mpp.fill_rotation(val)


@then(parsers.parse("{map_name} image rotation is set to {val} degrees"))
def rotation_gets_changed(
    mpp: MapPlantingPage, mmp: MapManagementPage, map_name, val, worker_uuid
):
    mpp.to_map_management_page()
    mmp.verify()
    mmp.to_map_planting_page(map_name + worker_uuid)
    mpp.check_base_layer()
    mpp.expect_rotation_to_have_value(val)


# Scenario 3: Successfully scale the background image


@when(parsers.parse("I change the scale of the image to {val} percent"))
def change_scale(mpp: MapPlantingPage, val):
    mpp.select_birdie_background()
    mpp.expect_background_image("/Photos/Birdie.jpg")
    mpp.check_base_layer()
    mpp.fill_scaling(val)


@then(parsers.parse("{map_name} image scale is set to {val} percent"))
def scale_gets_changed(
    mpp: MapPlantingPage, mmp: MapManagementPage, map_name, val, worker_uuid
):
    mpp.to_map_management_page()
    mmp.verify()
    mmp.to_map_planting_page(map_name + worker_uuid)
    mpp.check_base_layer()
    mpp.expect_scaling_to_have_value(val)
