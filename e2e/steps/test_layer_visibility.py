from pytest_bdd import scenarios, given, when, then


scenarios("features/layer_visibility.feature")


@given(("I am on the {name} map page"))
def on_planting_screen():
    # TODO use rebased method here
    pass


# Scenario 1: Successfully change base layer visibility


@when("I turn the plant layer visibility off")
def turn_plant_layer_visibility_off():
    pass


@then(("all plants are invisible"))
def plants_are_invisible():
    pass


# Scenario 2: Successfully change base layer visibility


@when("I chose a background")
def chose_a_background():
    pass


@when("I turn the base layer visiblity off")
def turn_base_layer_invisibility_off():
    pass


@then(("the base layer is invisible"))
def base_layer_is_invisible():
    pass
