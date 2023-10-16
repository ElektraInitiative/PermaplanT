from playwright.sync_api import Page
from pytest_bdd import scenario, when, then

from e2e.pages.seeds.management import SeedManagementPage

PLANT_NAME = "Indian abelia (Abelia triflora)"
ADDITIONAL_NAME = "SUT"
PLANT_NAME_WITH_ADDITIONAL = f"Indian abelia - {ADDITIONAL_NAME} (Abelia triflora)"
AMOUNT = "Enough"
ORIGIN = "Origin SUT"
TASTE = "Taste SUT"


@scenario("features/seed_creation.feature", "Successful seed creation")
def test_seed_creation():
    pass


@when("I provide all necessary details")
def provide_seed_details(page: Page):
    smp = SeedManagementPage(page)
    scp = smp.to_seed_create_page()
    scp.create_a_seed(PLANT_NAME, AMOUNT, ADDITIONAL_NAME, ORIGIN, TASTE)


@then("I can successfully create a new seed without an error message")
def create_seed_success(page: Page):
    smp = SeedManagementPage(page)
    smp.expect_alert_is_visible()
    smp.expect_first_row_cell_exists(PLANT_NAME_WITH_ADDITIONAL)
    smp.expect_first_row_cell_exists(AMOUNT)
    smp.expect_first_row_cell_exists(ORIGIN)


# smp.archive_first_seed()
