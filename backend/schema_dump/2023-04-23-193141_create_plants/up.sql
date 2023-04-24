-- Your SQL goes here
CREATE TYPE DECIDUOUS_OR_EVERGREEN AS ENUM ('deciduous', 'evergreen');
CREATE TYPE EXTERNAL_SOURCE AS ENUM (
    'practicalplants',
    'permapeople',
    'reinsaat'
);
CREATE TYPE FERTILITY AS ENUM ('self fertile', 'self sterile');
CREATE TYPE FLOWER_TYPE AS ENUM (
    'dioecious',
    'monoecious',
    'hermaphrodite'
);
CREATE TYPE GROWTH_RATE AS ENUM ('slow', 'moderate', 'vigorous');
CREATE TYPE HERBACEOUS_OR_WOODY AS ENUM ('herbaceous', 'woody');
CREATE TYPE LIFE_CYCLE AS ENUM ('annual', 'biennial', 'perennial');
CREATE TYPE LIGHT_REQUIREMENT AS ENUM (
    'Full sun',
    'Partial sun/shade',
    'Full shade'
);
CREATE TYPE NUTRITION_DEMAND AS ENUM (
    'light feeder',
    'moderate feeder',
    'heavy feeder'
);
CREATE TYPE PROPAGATION_METHOD AS ENUM (
    'Seed - direct sow',
    'Seed - transplant',
    'Division',
    'Cuttings',
    'Layering',
    'Spores',
    'Seed'
);
CREATE TYPE SHADE AS ENUM (
    'no shade',
    'light shade',
    'partial shade',
    'permanent shade',
    'permanent deep shade'
);
CREATE TYPE SOIL_PH AS ENUM (
    'very acid',
    'acid',
    'neutral',
    'alkaline',
    'very alkaline'
);
CREATE TYPE SOIL_TEXTURE AS ENUM (
    'sandy',
    'loamy',
    'clay',
    'heavy clay'
);
CREATE TYPE SOIL_WATER_RETENTION AS ENUM ('well drained', 'moist', 'wet');
CREATE TYPE WATER_REQUIREMENT AS ENUM ('Dry', 'Moist', 'Wet', 'Water');
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    unique_name TEXT NOT NULL,
    common_name_en TEXT [],
    common_name_de TEXT [],
    family TEXT,
    genus TEXT,
    edible_uses_en TEXT,
    medicinal_uses TEXT,
    material_uses_and_functions TEXT,
    botanic TEXT,
    material_uses TEXT,
    functions TEXT,
    heat_zone SMALLINT,
    shade TEXT,
    soil_ph SOIL_PH [],
    soil_texture SOIL_TEXTURE [],
    soil_water_retention SOIL_WATER_RETENTION [],
    environmental_tolerances TEXT [],
    native_geographical_range TEXT,
    native_environment TEXT,
    ecosystem_niche TEXT,
    deciduous_or_evergreen DECIDUOUS_OR_EVERGREEN,
    herbaceous_or_woody HERBACEOUS_OR_WOODY,
    life_cycle LIFE_CYCLE [],
    growth_rate GROWTH_RATE [],
    height TEXT,
    width TEXT,
    fertility FERTILITY [],
    flower_colour TEXT,
    flower_type FLOWER_TYPE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    has_drought_tolerance BOOLEAN,
    tolerates_wind BOOLEAN,
    plant_references TEXT [],
    is_tree BOOLEAN,
    nutrition_demand NUTRITION_DEMAND,
    preferable_permaculture_zone SMALLINT,
    article_last_modified_at TIMESTAMP,
    hardiness_zone TEXT,
    light_requirement LIGHT_REQUIREMENT [],
    water_requirement WATER_REQUIREMENT [],
    propagation_method PROPAGATION_METHOD [],
    alternate_name TEXT,
    diseases TEXT,
    edible BOOLEAN,
    edible_parts TEXT [],
    germination_temperature TEXT,
    introduced_into TEXT,
    habitus TEXT,
    medicinal_parts TEXT,
    native_to TEXT,
    plants_for_a_future TEXT,
    plants_of_the_world_online_link TEXT,
    plants_of_the_world_online_link_synonym TEXT,
    pollination TEXT,
    propagation_transplanting TEXT,
    resistance TEXT,
    root_type TEXT,
    seed_planting_depth_en TEXT,
    seed_viability TEXT,
    slug TEXT,
    spread TEXT,
    utility TEXT,
    warning TEXT,
    when_to_plant_cuttings TEXT,
    when_to_plant_division TEXT,
    when_to_plant_transplant TEXT,
    when_to_sow_indoors TEXT,
    sowing_outdoors_en TEXT,
    when_to_start_indoors_weeks TEXT,
    when_to_start_outdoors_weeks TEXT,
    cold_stratification_temperature TEXT,
    cold_stratification_time TEXT,
    days_to_harvest TEXT,
    habitat TEXT,
    spacing_en TEXT,
    wikipedia_url TEXT,
    days_to_maturity TEXT,
    pests TEXT,
    version TEXT,
    germination_time TEXT,
    description TEXT,
    parent_id TEXT,
    external_source EXTERNAL_SOURCE,
    external_id TEXT,
    external_url TEXT,
    root_depth TEXT,
    external_article_number TEXT,
    external_portion_content TEXT,
    sowing_outdoors_de TEXT,
    sowing_outdoors SMALLINT [],
    harvest_time SMALLINT [],
    spacing_de TEXT,
    required_quantity_of_seeds_de TEXT,
    required_quantity_of_seeds_en TEXT,
    seed_planting_depth_de TEXT,
    seed_weight_1000_de TEXT,
    seed_weight_1000_en TEXT,
    seed_weight_1000 FLOAT,
    machine_cultivation_possible TEXT,
    edible_uses_de TEXT,
    CONSTRAINT plants_unique_name_key UNIQUE (unique_name),
    CHECK (
        heat_zone IS NULL
        OR (
            heat_zone >= 0
            AND heat_zone <= 13
        )
    ),
    CHECK (
        preferable_permaculture_zone IS NULL
        OR (
            preferable_permaculture_zone >= -1
            AND preferable_permaculture_zone <= 6
        )
    )
);
