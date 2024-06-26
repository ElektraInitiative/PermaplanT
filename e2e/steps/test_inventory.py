from playwright.sync_api import Page
from pytest_bdd import scenario, when, then

from e2e.pages.inventory.management import SeedManagementPage


@scenario("features/seeds.feature", "Successful seed creation")
def test_seeds():
    pass


@when("I create a new seed")
def provide_seed_details(page: Page):
    smp = SeedManagementPage(page)
    scp = smp.to_seed_create_page()
    scp.create_a_seed(additional_name="SUT create")


@then("I can successfully create a new seed without an error message")
def create_seed_success(page: Page):
    smp = SeedManagementPage(page)
    smp.expect_alert_is_visible()
    smp.expect_first_row_cell_exists("Indian Abelia - SUT create (Abelia triflora)")
    smp.expect_first_row_cell_exists("Enough")
    smp.expect_first_row_cell_exists("Origin SUT")


@scenario("features/seeds.feature", "Successful seed editing")
def test_seed_editing():
    pass


@when("I create another new seed")
def create_seed_for_editing(page: Page):
    smp = SeedManagementPage(page)
    scp = smp.to_seed_create_page()
    scp.create_a_seed(additional_name="SUT editing")


@when("I edit this seed")
def editing_seed(page: Page):
    smp = SeedManagementPage(page)
    sep = smp.to_seed_edit_page(
        "Indian Abelia - SUT editing (Abelia triflora) Enough Organic 2022 Origin SUT Edit seed Archive seed"
    )
    sep.set_additional_name("SUT edited")
    sep.set_amount("Not enough")
    sep.set_quality("Not organic")
    sep.set_origin("New origin SUT")
    sep.click_edit()


@then("the edited seed is saved and shown on the overview page")
def edited_seed_success(page: Page):
    smp = SeedManagementPage(page)
    smp.expect_first_row_cell_exists("Indian Abelia - SUT edited (Abelia triflora)")
    smp.expect_first_row_cell_exists("Not enough")
    smp.expect_first_row_cell_exists("Not organic")
    smp.expect_first_row_cell_exists("New origin SUT")


@scenario("features/seeds.feature", "Successful seed search")
def test_seed_search():
    pass


@when("I search for a seed")
def search_seed(page: Page):
    smp = SeedManagementPage(page)
    scp = smp.to_seed_create_page()
    scp.create_a_seed(additional_name="SUT search")
    smp.search("SUT search")


@then("I can see the seed in the overview page")
def searched_seed_exists(page: Page):
    smp = SeedManagementPage(page)
    smp.expect_first_row_cell_exists("Indian Abelia - SUT search (Abelia triflora)")
    smp.expect_first_row_cell_exists("Enough")
    smp.expect_first_row_cell_exists("Organic")
    smp.expect_first_row_cell_exists("Origin SUT")


@scenario("features/seeds.feature", "Searching seed that does not exists")
def test_seed_search_not_existing_seed():
    pass


@when("I search for a seed that does not exist")
def search_seed_that_does_not_exist(page: Page):
    smp = SeedManagementPage(page)
    smp.search("AAAAAAAAA")


@then("the search result is empty")
def searched_seed_does_not_exist(page: Page):
    smp = SeedManagementPage(page)
    smp.expect_first_row_cell_exists("Sorry, I could not find this seed.")


@scenario("features/seeds.feature", "Archving a seed")
def test_seed_archive():
    pass


@when("I try to archive a seed")
def archive_seed(page: Page):
    smp = SeedManagementPage(page)
    scp = smp.to_seed_create_page()
    scp.create_a_seed(additional_name="SUT archive")
    smp.archive_seed(
        "Indian Abelia - SUT archive (Abelia triflora) Enough Organic 2022 Origin SUT Edit seed Archive seed"
    )


@then("the seed disapears")
def archived_seed_disapears(page: Page):
    smp = SeedManagementPage(page)
    smp.expect_first_row_cell_does_not_exist("SUT archive")


@then("I have the possiblity to restore it")
def positive_notification(page: Page):
    smp = SeedManagementPage(page)
    smp.expect_restore_button_to_be_visible()
