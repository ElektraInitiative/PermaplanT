--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: deciduous_or_evergreen; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.deciduous_or_evergreen AS ENUM (
    'deciduous',
    'evergreen'
);


ALTER TYPE public.deciduous_or_evergreen OWNER TO permaplant;

--
-- Name: external_source; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.external_source AS ENUM (
    'practicalplants',
    'permapeople',
    'reinsaat'
);


ALTER TYPE public.external_source OWNER TO permaplant;

--
-- Name: fertility; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.fertility AS ENUM (
    'self fertile',
    'self sterile'
);


ALTER TYPE public.fertility OWNER TO permaplant;

--
-- Name: flower_type; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.flower_type AS ENUM (
    'dioecious',
    'monoecious',
    'hermaphrodite'
);


ALTER TYPE public.flower_type OWNER TO permaplant;

--
-- Name: growth_rate; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.growth_rate AS ENUM (
    'slow',
    'moderate',
    'vigorous'
);


ALTER TYPE public.growth_rate OWNER TO permaplant;

--
-- Name: herbaceous_or_woody; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.herbaceous_or_woody AS ENUM (
    'herbaceous',
    'woody'
);


ALTER TYPE public.herbaceous_or_woody OWNER TO permaplant;

--
-- Name: life_cycle; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.life_cycle AS ENUM (
    'annual',
    'biennial',
    'perennial'
);


ALTER TYPE public.life_cycle OWNER TO permaplant;

--
-- Name: light_requirement; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.light_requirement AS ENUM (
    'full sun',
    'partial sun/shade',
    'full shade'
);


ALTER TYPE public.light_requirement OWNER TO permaplant;

--
-- Name: nutrition_demand; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.nutrition_demand AS ENUM (
    'light feeder',
    'moderate feeder',
    'heavy feeder'
);


ALTER TYPE public.nutrition_demand OWNER TO permaplant;

--
-- Name: propagation_method; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.propagation_method AS ENUM (
    'seed - direct sow',
    'seed - transplant',
    'division',
    'cuttings',
    'layering',
    'spores',
    'seed'
);


ALTER TYPE public.propagation_method OWNER TO permaplant;

--
-- Name: quality; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.quality AS ENUM (
    'Organic',
    'Not organic',
    'Unknown'
);


ALTER TYPE public.quality OWNER TO permaplant;

--
-- Name: quantity; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.quantity AS ENUM (
    'Nothing',
    'Not enough',
    'Enough',
    'More than enough'
);


ALTER TYPE public.quantity OWNER TO permaplant;

--
-- Name: shade; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.shade AS ENUM (
    'no shade',
    'light shade',
    'partial shade',
    'permanent shade',
    'permanent deep shade'
);


ALTER TYPE public.shade OWNER TO permaplant;

--
-- Name: soil_ph; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.soil_ph AS ENUM (
    'very acid',
    'acid',
    'neutral',
    'alkaline',
    'very alkaline'
);


ALTER TYPE public.soil_ph OWNER TO permaplant;

--
-- Name: soil_texture; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.soil_texture AS ENUM (
    'sandy',
    'loamy',
    'clay',
    'heavy clay'
);


ALTER TYPE public.soil_texture OWNER TO permaplant;

--
-- Name: soil_water_retention; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.soil_water_retention AS ENUM (
    'well drained',
    'moist',
    'wet'
);


ALTER TYPE public.soil_water_retention OWNER TO permaplant;

--
-- Name: water_requirement; Type: TYPE; Schema: public; Owner: permaplant
--

CREATE TYPE public.water_requirement AS ENUM (
    'dry',
    'moist',
    'wet',
    'water'
);


ALTER TYPE public.water_requirement OWNER TO permaplant;

--
-- Name: diesel_manage_updated_at(regclass); Type: FUNCTION; Schema: public; Owner: permaplant
--

CREATE FUNCTION public.diesel_manage_updated_at(_tbl regclass) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %s
                    FOR EACH ROW EXECUTE PROCEDURE diesel_set_updated_at()', _tbl);
END;
$$;


ALTER FUNCTION public.diesel_manage_updated_at(_tbl regclass) OWNER TO permaplant;

--
-- Name: diesel_set_updated_at(); Type: FUNCTION; Schema: public; Owner: permaplant
--

CREATE FUNCTION public.diesel_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (
        NEW IS DISTINCT FROM OLD AND
        NEW.updated_at IS NOT DISTINCT FROM OLD.updated_at
    ) THEN
        NEW.updated_at := current_timestamp;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.diesel_set_updated_at() OWNER TO permaplant;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __diesel_schema_migrations; Type: TABLE; Schema: public; Owner: permaplant
--

CREATE TABLE public.__diesel_schema_migrations (
    version character varying(50) NOT NULL,
    run_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.__diesel_schema_migrations OWNER TO permaplant;

--
-- Name: plants; Type: TABLE; Schema: public; Owner: permaplant
--

CREATE TABLE public.plants (
    id integer NOT NULL,
    unique_name text NOT NULL,
    common_name_en text[],
    common_name_de text[],
    family text,
    genus text,
    edible_uses_en text,
    medicinal_uses text,
    material_uses_and_functions text,
    botanic text,
    material_uses text,
    functions text,
    heat_zone smallint,
    shade public.shade,
    soil_ph public.soil_ph[],
    soil_texture public.soil_texture[],
    soil_water_retention public.soil_water_retention[],
    environmental_tolerances text[],
    native_geographical_range text,
    native_environment text,
    ecosystem_niche text,
    deciduous_or_evergreen public.deciduous_or_evergreen,
    herbaceous_or_woody public.herbaceous_or_woody,
    life_cycle public.life_cycle[],
    growth_rate public.growth_rate[],
    height text,
    width text,
    fertility public.fertility[],
    flower_colour text,
    flower_type public.flower_type,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    has_drought_tolerance boolean,
    tolerates_wind boolean,
    plant_references text[],
    is_tree boolean,
    nutrition_demand public.nutrition_demand,
    preferable_permaculture_zone smallint,
    article_last_modified_at timestamp without time zone,
    hardiness_zone text,
    light_requirement public.light_requirement[],
    water_requirement public.water_requirement[],
    propagation_method public.propagation_method[],
    alternate_name text,
    diseases text,
    edible boolean,
    edible_parts text[],
    germination_temperature text,
    introduced_into text,
    habitus text,
    medicinal_parts text,
    native_to text,
    plants_for_a_future text,
    plants_of_the_world_online_link text,
    plants_of_the_world_online_link_synonym text,
    pollination text,
    propagation_transplanting_en text,
    resistance text,
    root_type text,
    seed_planting_depth_en text,
    seed_viability text,
    slug text,
    spread text,
    utility text,
    warning text,
    when_to_plant_cuttings_en text,
    when_to_plant_division_en text,
    when_to_plant_transplant_en text,
    when_to_sow_indoors_en text,
    sowing_outdoors_en text,
    when_to_start_indoors_weeks text,
    when_to_start_outdoors_weeks text,
    cold_stratification_temperature text,
    cold_stratification_time text,
    days_to_harvest text,
    habitat text,
    spacing_en text,
    wikipedia_url text,
    days_to_maturity text,
    pests text,
    version smallint,
    germination_time text,
    description text,
    parent_id text,
    external_source public.external_source,
    external_id text,
    external_url text,
    root_depth text,
    external_article_number text,
    external_portion_content text,
    sowing_outdoors_de text,
    sowing_outdoors smallint[],
    harvest_time smallint[],
    spacing_de text,
    required_quantity_of_seeds_de text,
    required_quantity_of_seeds_en text,
    seed_planting_depth_de text,
    seed_weight_1000_de text,
    seed_weight_1000_en text,
    seed_weight_1000 double precision,
    machine_cultivation_possible boolean,
    edible_uses_de text,
    CONSTRAINT plant_detail_heat_zone_check CHECK (((heat_zone IS NULL) OR ((heat_zone >= 0) AND (heat_zone <= 13)))),
    CONSTRAINT plant_detail_preferable_permaculture_zone_check CHECK (((preferable_permaculture_zone IS NULL) OR ((preferable_permaculture_zone >= '-1'::integer) AND (preferable_permaculture_zone <= 6))))
);


ALTER TABLE public.plants OWNER TO permaplant;

--
-- Name: plant_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: permaplant
--

CREATE SEQUENCE public.plant_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.plant_detail_id_seq OWNER TO permaplant;

--
-- Name: plant_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: permaplant
--

ALTER SEQUENCE public.plant_detail_id_seq OWNED BY public.plants.id;


--
-- Name: seeds; Type: TABLE; Schema: public; Owner: permaplant
--

CREATE TABLE public.seeds (
    id integer NOT NULL,
    name text NOT NULL,
    harvest_year smallint NOT NULL,
    use_by date,
    origin text,
    taste text,
    yield text,
    quantity public.quantity NOT NULL,
    quality public.quality,
    price smallint,
    generation smallint,
    notes text,
    variety text,
    plant_id integer
);


ALTER TABLE public.seeds OWNER TO permaplant;

--
-- Name: seeds_id_seq; Type: SEQUENCE; Schema: public; Owner: permaplant
--

CREATE SEQUENCE public.seeds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seeds_id_seq OWNER TO permaplant;

--
-- Name: seeds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: permaplant
--

ALTER SEQUENCE public.seeds_id_seq OWNED BY public.seeds.id;


--
-- Name: plants id; Type: DEFAULT; Schema: public; Owner: permaplant
--

ALTER TABLE ONLY public.plants ALTER COLUMN id SET DEFAULT nextval('public.plant_detail_id_seq'::regclass);


--
-- Name: seeds id; Type: DEFAULT; Schema: public; Owner: permaplant
--

ALTER TABLE ONLY public.seeds ALTER COLUMN id SET DEFAULT nextval('public.seeds_id_seq'::regclass);


--
-- Name: __diesel_schema_migrations __diesel_schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: permaplant
--

ALTER TABLE ONLY public.__diesel_schema_migrations
    ADD CONSTRAINT __diesel_schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: plants plant_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: permaplant
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plant_detail_pkey PRIMARY KEY (id);


--
-- Name: plants plant_unique_name_key; Type: CONSTRAINT; Schema: public; Owner: permaplant
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plant_unique_name_key UNIQUE (unique_name);


--
-- Name: seeds seeds_pkey; Type: CONSTRAINT; Schema: public; Owner: permaplant
--

ALTER TABLE ONLY public.seeds
    ADD CONSTRAINT seeds_pkey PRIMARY KEY (id);


--
-- Name: seeds seeds_plant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: permaplant
--

ALTER TABLE ONLY public.seeds
    ADD CONSTRAINT seeds_plant_id_fkey FOREIGN KEY (plant_id) REFERENCES public.plants(id);


--
-- PostgreSQL database dump complete
--
