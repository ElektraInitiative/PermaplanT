CREATE TYPE deciduous_or_evergreen AS ENUM (
    'deciduous',
    'evergreen'
);
CREATE TYPE fertility AS ENUM (
    'self fertile',
    'self sterile'
);
CREATE TYPE flower_type AS ENUM (
    'dioecious',
    'monoecious',
    'hermaphrodite'
);
CREATE TYPE growth_rate AS ENUM (
    'slow',
    'moderate',
    'vigorous'
);
CREATE TYPE herbaceous_or_woody AS ENUM (
    'herbaceous',
    'woody'
);
CREATE TYPE life_cycle AS ENUM (
    'annual',
    'biennial',
    'perennial'
);
CREATE TYPE nutrition_demand AS ENUM (
    'light feeder',
    'moderate feeder',
    'heavy feeder'
);
CREATE TYPE root_zone_tendancy AS ENUM (
    'surface',
    'shallow',
    'deep'
);
CREATE TYPE shade AS ENUM (
    'no shade',
    'light shade',
    'partial shade',
    'permanent shade',
    'permanent deep shade'
);
CREATE TYPE soil_ph AS ENUM (
    'very acid',
    'acid',
    'neutral',
    'alkaline',
    'very alkaline'
);
CREATE TYPE soil_texture AS ENUM (
    'sandy',
    'loamy',
    'clay',
    'heavy clay'
);
CREATE TYPE soil_water_retention AS ENUM (
    'well drained',
    'moist',
    'wet'
);
CREATE TYPE sun AS ENUM (
    'indirect sun',
    'partial sun',
    'full sun'
);
CREATE TYPE water AS ENUM (
    'low',
    'moderate',
    'high',
    'aquatic'
);
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    binomial_name CHARACTER VARYING UNIQUE NOT NULL,
    common_name TEXT [],
    common_name_de TEXT [],
    family CHARACTER VARYING,
    subfamily CHARACTER VARYING,
    genus CHARACTER VARYING,
    edible_uses CHARACTER VARYING,
    medicinal_uses CHARACTER VARYING,
    material_uses_and_functions CHARACTER VARYING,
    botanic CHARACTER VARYING,
    propagation CHARACTER VARYING,
    cultivation CHARACTER VARYING,
    environment CHARACTER VARYING,
    material_uses CHARACTER VARYING,
    functions CHARACTER VARYING,
    provides_forage_for CHARACTER VARYING,
    provides_shelter_for CHARACTER VARYING,
    hardiness_zone SMALLINT,
    heat_zone SMALLINT,
    water WATER,
    sun SUN,
    shade CHARACTER VARYING,
    soil_ph SOIL_PH [],
    soil_texture SOIL_TEXTURE [],
    soil_water_retention SOIL_WATER_RETENTION [],
    environmental_tolerances TEXT [],
    native_climate_zones CHARACTER VARYING,
    adapted_climate_zones CHARACTER VARYING,
    native_geographical_range CHARACTER VARYING,
    native_environment CHARACTER VARYING,
    ecosystem_niche CHARACTER VARYING,
    root_zone_tendancy ROOT_ZONE_TENDANCY,
    deciduous_or_evergreen DECIDUOUS_OR_EVERGREEN,
    herbaceous_or_woody HERBACEOUS_OR_WOODY,
    life_cycle LIFE_CYCLE [],
    growth_rate GROWTH_RATE,
    mature_size_height CHARACTER VARYING,
    mature_size_width CHARACTER VARYING,
    fertility FERTILITY [],
    pollinators CHARACTER VARYING,
    flower_colour CHARACTER VARYING,
    flower_type FLOWER_TYPE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    has_drought_tolerance BOOLEAN,
    tolerates_wind BOOLEAN,
    plant_references TEXT [],
    is_tree BOOLEAN,
    nutrition_demand NUTRITION_DEMAND,
    preferable_permaculture_zone SMALLINT,
    article_last_modified_at TIMESTAMP WITHOUT TIME ZONE,
    CHECK (
        (hardiness_zone IS NULL)
        OR ((hardiness_zone >= 0) AND (hardiness_zone <= 13))
    ),
    CHECK (
        (heat_zone IS NULL) OR ((heat_zone >= 0) AND (heat_zone <= 13))
    ),
    CHECK (
        (preferable_permaculture_zone IS NULL)
        OR (
            (preferable_permaculture_zone >= '-1'::INTEGER)
            AND (preferable_permaculture_zone <= 6)
        )
    )
);
