from e2e.pages.maps.planting import MapPlantingPage
from e2e.pages.maps.management import MapManagementPage
from pytest_bdd import scenarios, when, then, parsers

scenarios("features/base_layer.feature")


# Scenario 1: Successfully select a background image


@then(
    parsers.parse("{image_name} stays even when I leave {map_name} and come back later")
)
def background_image_stays(
    mpp: MapPlantingPage, mmp: MapManagementPage, image_name, map_name, worker_id
):
    mpp.to_map_management_page()
    mmp.verify()
    mmp.to_map_planting_page(map_name + worker_id)
    mpp.expect_background_image(image_name)


# Scenario 2: Successfully rotate the background image
# This test might be flaky, since it depends on the image to be loaded before
# the rotation is applied and to process the input before navigating away from the page.


@when(parsers.parse("I change the rotation of the image to {val} degrees"))
def change_rotation(mpp: MapPlantingPage, val):
    mpp.click_background_image("Birdie")
    mpp.expect_background_image("/Photos/Birdie.jpg")
    mpp.fill_rotation(val)


@then(parsers.parse("{map_name} image rotation is set to {val} degrees"))
def rotation_gets_changed(
    mpp: MapPlantingPage, mmp: MapManagementPage, map_name, val, worker_id
):
    mpp.to_map_management_page()
    mmp.verify()
    mmp.to_map_planting_page(map_name + worker_id)
    mpp.expect_rotation_to_have_value(val)


# Scenario 3: Successfully scale the background image
# This test might be flaky, since it depends on the image to be loaded before
# the scaling is applied and to process the input before navigating away from the page.


@when(parsers.parse("I change the scale of the image to {val} percent"))
def change_scale(mpp: MapPlantingPage, val):
    mpp.click_background_image("Frog")
    mpp.expect_background_image("/Photos/Frog.jpg")
    mpp.fill_scaling(val)


@then(parsers.parse("{map_name} image scale is set to {val} percent"))
def scale_gets_changed(
    mpp: MapPlantingPage, mmp: MapManagementPage, map_name, val, worker_id
):
    mpp.to_map_management_page()
    mmp.verify()
    mmp.to_map_planting_page(map_name + worker_id)
    mpp.expect_scaling_to_have_value(val)
