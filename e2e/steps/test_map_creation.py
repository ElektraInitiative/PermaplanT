from e2e.pages.home import HomePage
from e2e.pages.login import LoginPage
from e2e.pages.maps.create import MapCreatePage
from e2e.pages.maps.edit import MapEditPage
from e2e.pages.maps.management import MapManagementPage
from pytest_bdd import scenarios, given, when, then, parsers

scenarios("features/map_creation.feature")

# Scenario 1

@given("I am logged in and I am on the map management page")
def logged_in_and_on_map_management_page(hp: HomePage, lp: LoginPage):
    hp.load()
    hp.verify()
    hp.login_button_is_visible()
    hp.click_login_button()
    lp.login("Adi", "1234")
    hp.verify()
    hp.close_alert()
    hp.to_map_management_page()


@when(parsers.parse("I provides {name}, {privacy}, {description}, {latitude} and {longitude}"))
def provide_map_details(mmp: MapManagementPage, mcp: MapCreatePage, name, privacy, description, latitude, longitude):
    mmp.to_map_create_page()
    mcp.create_a_map(name, description=description, latitude=latitude, longitude=longitude)


@then(parsers.parse("I can successfully create a new map {name} without an error message"))
def create_map_successfully(mcp: MapCreatePage, name, mmp: MapManagementPage):
    mcp.click_create()
    mcp.alert_is_hidden()
    mmp.visible(name)


# Scenario 2


@given("I create a new map")
def create_the_map_to_be_edited(mmp: MapManagementPage, mcp: MapCreatePage):
    mmp.to_map_create_page()
    mcp.create_a_map("SUTEditMe")


@when("I edit the map")
def can_edit_created_map(mmp: MapManagementPage, mep: MapEditPage):
    mmp.to_map_edit_page("SUTEditMe")
    mep.fill_name("SUTEdited")
    mep.fill_description("NewDescription")
    mep.fill_longitude("33")
    mep.fill_latitude("33")


@then("I can successfully save it without an error message")
def successfully_edit(mmp: MapManagementPage, mep: MapEditPage):
    mep.click_save()
    mmp.alert_is_hidden()
    mmp.visible("SUTEdited")


# Scenario 3


@given(parsers.parse("I create a map {mapname}"))
def create_same_map(mmp: MapManagementPage, mcp: MapCreatePage, mapname):
    mmp.to_map_create_page()
    mcp.create_a_map(mapname)
    mmp.visible(mapname)


@when(parsers.parse("I try to create the same map {mapname}"))
def create_the_same_map_again(mmp: MapManagementPage, mcp: MapCreatePage, mapname):
    mmp.to_map_create_page()
    mcp.create_a_map(mapname)


@then("the app displays an error message")
def error_message_is_displayed(mmp: MapManagementPage):
    mmp.alert_is_visible()


@then(parsers.parse("my map {mapname} is not created"))
def error_message_is_displayed(mmp: MapManagementPage, mapname):
    mmp.visible(mapname)
