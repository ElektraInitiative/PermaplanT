CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

CREATE TYPE deciduous_or_evergreen AS ENUM (
    'deciduous',
    'evergreen'
);


CREATE TYPE external_source AS ENUM (
    'practicalplants',
    'permapeople',
    'reinsaat'
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


CREATE TYPE layer_type AS ENUM (
    'base',
    'soil',
    'todo',
    'label',
    'paths',
    'photo',
    'shade',
    'trees',
    'winds',
    'zones',
    'plants',
    'drawing',
    'terrain',
    'habitats',
    'warnings',
    'watering',
    'landscape',
    'hydrology',
    'fertilization',
    'infrastructure'
);


CREATE TYPE life_cycle AS ENUM (
    'annual',
    'biennial',
    'perennial'
);

CREATE TYPE light_requirement AS ENUM (
    'full sun',
    'partial sun/shade',
    'full shade'
);

CREATE TYPE nutrition_demand AS ENUM (
    'light feeder',
    'moderate feeder',
    'heavy feeder'
);

CREATE TYPE plant_height AS ENUM (
    'low',
    'medium',
    'high',
    'na'
);

CREATE TYPE plant_spread AS ENUM (
    'narrow',
    'medium',
    'wide',
    'na'
);

CREATE TYPE privacy_options AS ENUM (
    'private',
    'protected',
    'public'
);


CREATE TYPE propagation_method AS ENUM (
    'seed - direct sow',
    'seed - transplant',
    'division',
    'cuttings',
    'layering',
    'spores',
    'seed'
);

CREATE TYPE quality AS ENUM (
    'organic',
    'not organic',
    'unknown'
);

CREATE TYPE quantity AS ENUM (
    'nothing',
    'not enough',
    'enough',
    'more than enough'
);

CREATE TYPE relation_type AS ENUM (
    'companion',
    'neutral',
    'antagonist'
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

CREATE TYPE water_requirement AS ENUM (
    'dry',
    'moist',
    'wet',
    'water'
);

CREATE FUNCTION check_layer_type() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (SELECT type FROM layers WHERE id = NEW.layer_id) != 'plants' THEN
        RAISE EXCEPTION 'Layer type must be "plants"';
    END IF;
    RETURN NEW;
END;
$$;


CREATE TABLE layers (
    id integer NOT NULL,
    map_id integer NOT NULL,
    type layer_type NOT NULL,
    name text NOT NULL,
    is_alternative boolean NOT NULL
);


CREATE SEQUENCE layers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE maps (
    id integer NOT NULL,
    name text NOT NULL,
    creation_date date NOT NULL,
    deletion_date date,
    last_visit date,
    is_inactive boolean NOT NULL,
    zoom_factor smallint NOT NULL,
    honors smallint NOT NULL,
    visits smallint NOT NULL,
    harvested smallint NOT NULL,
    privacy privacy_options NOT NULL,
    description text,
    location geography(Point,4326),
    owner_id uuid NOT NULL
);

CREATE SEQUENCE maps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE plants (
    id integer NOT NULL,
    unique_name text NOT NULL,
    common_name_en text[],
    common_name_de text[],
    family text,
    genus text,
    edible_uses_en text,
    --medicinal_uses text,
    material_uses_and_functions text,
    botanic text,
    --material_uses text,
    functions text,
    heat_zone smallint,
    shade shade,
    soil_ph soil_ph[],
    soil_texture soil_texture[],
    soil_water_retention soil_water_retention[],
    --environmental_tolerances text[],
    --native_geographical_range text,
    --native_environment text,
    ecosystem_niche text,
    deciduous_or_evergreen deciduous_or_evergreen,
    herbaceous_or_woody herbaceous_or_woody,
    life_cycle life_cycle[],
    growth_rate growth_rate[],
    height plant_height,
    fertility fertility[],
    --flower_colour text,
    flower_type flower_type,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    has_drought_tolerance boolean,
    tolerates_wind boolean,
    plant_references text[],
    is_tree boolean,
    nutrition_demand nutrition_demand,
    preferable_permaculture_zone smallint,
    article_last_modified_at timestamp without time zone,
    hardiness_zone text,
    light_requirement light_requirement[],
    water_requirement water_requirement[],
    propagation_method propagation_method[],
    alternate_name text,
    --diseases text,
    edible boolean,
    edible_parts text[],
    --germination_temperature text,
    --introduced_into text,
    --habitus text,
    --medicinal_parts text,
    --native_to text,
    --plants_for_a_future text,
    --plants_of_the_world_online_link text,
    --plants_of_the_world_online_link_synonym text,
    --pollination text,
    --propagation_transplanting_en text,
    --resistance text,
    --root_type text,
    --seed_planting_depth_en text,
    --seed_viability text,
    --slug text,
    spread plant_spread,
    --utility text,
    warning text,
    --when_to_plant_cuttings_en text,
    --when_to_plant_division_en text,
    --when_to_plant_transplant_en text,
    --when_to_sow_indoors_en text,
    --sowing_outdoors_en text,
    --when_to_start_indoors_weeks text,
    --when_to_start_outdoors_weeks text,
    --cold_stratification_temperature text,
    --cold_stratification_time text,
    --days_to_harvest text,
    --habitat text,
    --spacing_en text,
    --wikipedia_url text,
    --days_to_maturity text,
    --pests text,
    version smallint,
    --germination_time text,
    --description text,
    --parent_id text,
    external_source external_source,
    --external_id text,
    --external_url text,
    --root_depth text,
    --external_article_number text,
    --external_portion_content text,
    --sowing_outdoors_de text,
    sowing_outdoors smallint[],
    harvest_time smallint[],
    --spacing_de text,
    --required_quantity_of_seeds_de text,
    --required_quantity_of_seeds_en text,
    --seed_planting_depth_de text,
    --seed_weight_1000_de text,
    --seed_weight_1000_en text,
    seed_weight_1000 double precision,
    --machine_cultivation_possible boolean,
    --edible_uses_de text,
    CONSTRAINT plant_detail_heat_zone_check CHECK (((heat_zone IS NULL) OR ((heat_zone >= 0) AND (heat_zone <= 13)))),
    CONSTRAINT plant_detail_preferable_permaculture_zone_check CHECK (((preferable_permaculture_zone IS NULL) OR ((preferable_permaculture_zone >= '-1'::integer) AND (preferable_permaculture_zone <= 6))))
);

CREATE SEQUENCE plant_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE plantings (
    id uuid NOT NULL,
    layer_id integer NOT NULL,
    plant_id integer NOT NULL,
    x integer NOT NULL,
    y integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    rotation real NOT NULL,
    scale_x real NOT NULL,
    scale_y real NOT NULL,
    add_date date,
    remove_date date,
    create_date date DEFAULT CURRENT_DATE NOT NULL,
    delete_date date
);



CREATE TABLE relations (
    plant1 integer NOT NULL,
    plant2 integer NOT NULL,
    relation relation_type NOT NULL,
    note text
);


CREATE TABLE seeds (
    id integer NOT NULL,
    name text NOT NULL,
    harvest_year smallint NOT NULL,
    use_by date,
    origin text,
    taste text,
    yield text,
    quantity quantity NOT NULL,
    quality quality,
    price smallint,
    generation smallint,
    notes text,
    variety text,
    plant_id integer,
    owner_id uuid NOT NULL
);


CREATE SEQUENCE seeds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ONLY layers ALTER COLUMN id SET DEFAULT nextval('layers_id_seq'::regclass);


ALTER TABLE ONLY maps ALTER COLUMN id SET DEFAULT nextval('maps_id_seq'::regclass);


ALTER TABLE ONLY plants ALTER COLUMN id SET DEFAULT nextval('plant_detail_id_seq'::regclass);


ALTER TABLE ONLY seeds ALTER COLUMN id SET DEFAULT nextval('seeds_id_seq'::regclass);


ALTER TABLE ONLY layers
    ADD CONSTRAINT layers_pkey PRIMARY KEY (id);


ALTER TABLE ONLY maps
    ADD CONSTRAINT map_unique_name UNIQUE (name);


ALTER TABLE ONLY maps
    ADD CONSTRAINT maps_pkey PRIMARY KEY (id);


ALTER TABLE ONLY plants
    ADD CONSTRAINT plant_detail_pkey PRIMARY KEY (id);

ALTER TABLE ONLY plants
    ADD CONSTRAINT plant_unique_name_key UNIQUE (unique_name);


ALTER TABLE ONLY plantings
    ADD CONSTRAINT plantings_pkey PRIMARY KEY (id);


ALTER TABLE ONLY relations
    ADD CONSTRAINT relations_pkey PRIMARY KEY (plant1, plant2);


ALTER TABLE ONLY seeds
    ADD CONSTRAINT seeds_pkey PRIMARY KEY (id);


CREATE TRIGGER check_layer_type_before_insert_or_update BEFORE INSERT OR UPDATE ON plantings FOR EACH ROW EXECUTE FUNCTION check_layer_type();


ALTER TABLE ONLY layers
    ADD CONSTRAINT layers_map_id_fkey FOREIGN KEY (map_id) REFERENCES maps(id);


ALTER TABLE ONLY plantings
    ADD CONSTRAINT plantings_layer_id_fkey FOREIGN KEY (layer_id) REFERENCES layers(id);


ALTER TABLE ONLY plantings
    ADD CONSTRAINT plantings_plant_id_fkey FOREIGN KEY (plant_id) REFERENCES plants(id);


ALTER TABLE ONLY relations
    ADD CONSTRAINT relations_plant1_fkey FOREIGN KEY (plant1) REFERENCES plants(id);


ALTER TABLE ONLY relations
    ADD CONSTRAINT relations_plant2_fkey FOREIGN KEY (plant2) REFERENCES plants(id);

ALTER TABLE ONLY seeds
    ADD CONSTRAINT seeds_plant_id_fkey FOREIGN KEY (plant_id) REFERENCES plants(id);
