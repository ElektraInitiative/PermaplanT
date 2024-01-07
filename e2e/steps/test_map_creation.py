from e2e.steps.common_steps import login
from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.edit import MapEditPage
from e2e.pages.maps.management import MapManagementPage
from pytest_bdd import scenarios, given, when, then, parsers


scenarios("features/map_creation.feature")


@given("I am on the map management page")
def logged_in_and_on_map_management_page(hp: HomePage, lp: LoginPage):
    login(hp, lp)
    hp.to_map_management_page()


# Scenario 1: Successful map creation


@when(
    parsers.parse(
        "I provide {name}, {privacy}, {description}, {latitude} and {longitude}"
    )
)
def provide_map_details(
    mmp: MapManagementPage,
    mcp: MapCreatePage,
    name,
    privacy,
    description,
    latitude,
    longitude,
):
    mmp.to_map_create_page()
    mcp.create_a_map(
        name,
        privacy=privacy,
        description=description,
        latitude=latitude,
        longitude=longitude,
    )


@then(parsers.parse("I can successfully create {name} without an error message"))
def create_map_successfully(mcp: MapCreatePage, name, mmp: MapManagementPage):
    mcp.expect_alert_is_hidden()
    mmp.expect_mapname_is_visible(name)


# Scenario 2: Editing a map


@given(parsers.parse("I create a new map {name}"))
def create_the_map_to_be_edited(mmp: MapManagementPage, mcp: MapCreatePage, name):
    mmp.to_map_create_page()
    mcp.create_a_map(name)


@when(parsers.parse("I edit {name} to {new_name} with {new_description}"))
def can_edit_created_map(
    mmp: MapManagementPage, mep: MapEditPage, name, new_name, new_description
):
    mmp.to_map_edit_page(name)
    mep.fill_name(new_name)
    mep.fill_description(new_description)


@then(parsers.parse("I can successfully save {name} without an error message"))
def successfully_edit(mmp: MapManagementPage, mep: MapEditPage, name):
    mep.click_save()
    mmp.expect_alert_is_hidden()
    mmp.expect_mapname_is_visible(name)


# Scenario 3: Error case, create a map with an already existing name


@given(parsers.parse("I create a map {name}"))
def create_same_map(mmp: MapManagementPage, mcp: MapCreatePage, name):
    mmp.to_map_create_page()
    mcp.create_a_map(name)
    mmp.expect_mapname_is_visible(name)


@when(parsers.parse("I try to create the same map {name}"))
def create_the_same_map_again(mmp: MapManagementPage, mcp: MapCreatePage, name):
    mmp.to_map_create_page()
    mcp.try_create_a_map(name)


@then("the app displays an error message")
def error_message_is_displayed(mcp: MapCreatePage):
    mcp.expect_alert_is_visible()


@then(parsers.parse("my map {mapname} is not created"))
def map_is_not_created(mcp: MapCreatePage, mapname):
    mcp.expect_mapname_editable(mapname)
