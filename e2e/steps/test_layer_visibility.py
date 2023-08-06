from pytest_bdd import scenarios, given, when, then


scenarios("features/planting.feature")


@given(("I am on the {name} map page"))
def on_planting_screen():
    # TODO use rebased method here
    pass


# Scenario 1: Successfully change base layer visibility


@when("I turn the plant layer visiblity off")
def turn_plant_layer_visibility_off():
    pass


@then(("all plants are invisible"))
def plants_are_invisible():
    pass


# Scenario 2: Successfully change base layer visibility


@when("I turn the base layer visiblity off")
def turn_base_layer_invisibility_off():
    pass


@then(("the base layer is invisible"))
def base_layer_is_invisible():
    pass


# Scenario 3: Successfully change plant layer opacity


@when("I lower the opacity of the plant layer")
def lower_plant_layer_opacity():
    pass


@then(("all plants opacity gets lowered"))
def plant_layer_opacity_is_lowered():
    pass


# Scenario 3: Successfully change base layer opacity


@when("I lower the opacity of the base layer")
def lower_base_layer_opacity():
    pass


@then(("the base layers opacity gets lowered"))
def base_layer_opacity_is_lowered():
    pass
