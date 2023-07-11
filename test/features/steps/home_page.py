from behave import step


@step("Open PermaplanT Homepage")
def go_to_swag_labs(context):
    sb = context.sb
    sb.open("http://localhost:5173")
    sb.clear_local_storage()
    sb.assert_element("#home")


@step("Login to PermaplanT with {user} and {password}")
def login_to_swag_labs(context, user, password):
    sb = context.sb
    sb.js_click("#loginButton")
    sb.type("#username", user)
    sb.type("#password", password)
    sb.js_click("#kc-login")


@step("Verify that the current user is logged in")
def verify_logged_in(context):
    sb = context.sb
    sb.assert_element("#home")
    sb.assert_element("#logoutButton")


@step("Logout from PermaplanT")
def logout_from_swag_labs(context):
    sb = context.sb
    sb.js_click("#logoutButton")


@step("Verify on Homepage and logged out")
def verify_on_login_page(context):
    sb = context.sb
    sb.assert_element("#home")
    sb.assert_element("#loginButton")
