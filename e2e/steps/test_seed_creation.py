from playwright.sync_api import Page
from pytest_bdd import scenario, when, then

from e2e.pages.seeds.management import SeedManagementPage


@scenario('features/seed_creation.feature', 'Successful seed creation')
def test_seed_creation():
    pass


@when("I provide all necessary details")
def provide_seed_details(page: Page):
    smp = SeedManagementPage(page)
    scp = smp.to_seed_create_page()
    scp.create_a_seed()


@then("I can successfully create a new seed without an error message")
def create_seed_success(page: Page):
    smp = SeedManagementPage(page)
    smp.expect_alert_is_hidden()
    smp.expect_seed_exists("SUT")
    smp.to_seed_details_page("SUT")
