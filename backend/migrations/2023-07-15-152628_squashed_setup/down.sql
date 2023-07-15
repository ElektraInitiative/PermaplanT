-- Drop all triggers

DROP TRIGGER IF EXISTS check_layer_type_before_insert_or_update ON plantings;

-- Drop all foreign keys
-- Note: you may need to drop these if your SQL server doesn't drop them automatically when you drop tables.

ALTER TABLE IF EXISTS layers DROP CONSTRAINT IF EXISTS layers_map_id_fkey;
ALTER TABLE IF EXISTS plantings DROP CONSTRAINT IF EXISTS plantings_layer_id_fkey;
ALTER TABLE IF EXISTS plantings DROP CONSTRAINT IF EXISTS plantings_plant_id_fkey;
ALTER TABLE IF EXISTS relations DROP CONSTRAINT IF EXISTS relations_plant1_fkey;
ALTER TABLE IF EXISTS relations DROP CONSTRAINT IF EXISTS relations_plant2_fkey;
ALTER TABLE IF EXISTS seeds DROP CONSTRAINT IF EXISTS seeds_plant_id_fkey;

-- Drop all tables

DROP TABLE IF EXISTS layers;
DROP TABLE IF EXISTS maps;
DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS plants;
DROP TABLE IF EXISTS plantings;
DROP TABLE IF EXISTS relations;
DROP TABLE IF EXISTS seeds;

-- Drop all sequences

DROP SEQUENCE IF EXISTS layers_id_seq;
DROP SEQUENCE IF EXISTS maps_id_seq;
DROP SEQUENCE IF EXISTS plant_detail_id_seq;
DROP SEQUENCE IF EXISTS seeds_id_seq;

-- Drop all functions

DROP FUNCTION IF EXISTS check_layer_type();

-- Drop all types

DROP TYPE IF EXISTS deciduous_or_evergreen;
DROP TYPE IF EXISTS external_source;
DROP TYPE IF EXISTS fertility;
DROP TYPE IF EXISTS flower_type;
DROP TYPE IF EXISTS growth_rate;
DROP TYPE IF EXISTS herbaceous_or_woody;
DROP TYPE IF EXISTS layer_type;
DROP TYPE IF EXISTS life_cycle;
DROP TYPE IF EXISTS light_requirement;
DROP TYPE IF EXISTS nutrition_demand;
DROP TYPE IF EXISTS plant_height;
DROP TYPE IF EXISTS plant_spread;
DROP TYPE IF EXISTS privacy_options;
DROP TYPE IF EXISTS propagation_method;
DROP TYPE IF EXISTS quality;
DROP TYPE IF EXISTS quantity;
DROP TYPE IF EXISTS relation_type;
DROP TYPE IF EXISTS shade;
DROP TYPE IF EXISTS soil_ph;
DROP TYPE IF EXISTS soil_texture;
DROP TYPE IF EXISTS soil_water_retention;
DROP TYPE IF EXISTS water_requirement;

-- Drop all extensions

DROP EXTENSION IF EXISTS pg_trgm;

DROP EXTENSION IF EXISTS postgis;
