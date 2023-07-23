---- Drop foreign keys
ALTER TABLE seeds DROP CONSTRAINT seeds_plant_id_fkey;
ALTER TABLE relations DROP CONSTRAINT relations_plant2_fkey;
ALTER TABLE relations DROP CONSTRAINT relations_plant1_fkey;
ALTER TABLE plantings DROP CONSTRAINT plantings_plant_id_fkey;
ALTER TABLE plantings DROP CONSTRAINT plantings_layer_id_fkey;
ALTER TABLE layers DROP CONSTRAINT layers_map_id_fkey;
--
-- Drop triggers
DROP TRIGGER check_layer_type_before_insert_or_update ON plantings;

-- Drop primary keys
ALTER TABLE seeds DROP CONSTRAINT seeds_pkey;
ALTER TABLE relations DROP CONSTRAINT relations_pkey;
ALTER TABLE plantings DROP CONSTRAINT plantings_pkey;
ALTER TABLE plants DROP CONSTRAINT plant_detail_pkey;
ALTER TABLE plants DROP CONSTRAINT plant_unique_name_key;
ALTER TABLE maps DROP CONSTRAINT maps_pkey;
ALTER TABLE maps DROP CONSTRAINT map_unique_name;
ALTER TABLE layers DROP CONSTRAINT layers_pkey;

-- Drop tables
DROP TABLE plantings;
DROP TABLE layers;
DROP TABLE maps;
DROP TABLE seeds;
DROP TABLE relations;
DROP TABLE plants;


-- Drop sequences
DROP SEQUENCE seeds_id_seq;
DROP SEQUENCE plant_detail_id_seq;
DROP SEQUENCE maps_id_seq;
DROP SEQUENCE layers_id_seq;

-- Drop functions
DROP FUNCTION check_layer_type();

-- Drop types
DROP TYPE water_requirement;
--DROP TYPE soil_water_retention;
DROP TYPE soil_texture;
DROP TYPE soil_ph;
DROP TYPE shade;
DROP TYPE relation_type;
DROP TYPE quantity;
DROP TYPE quality;
DROP TYPE propagation_method;
DROP TYPE privacy_option;
DROP TYPE plant_spread;
DROP TYPE plant_height;
DROP TYPE nutrition_demand;
DROP TYPE light_requirement;
DROP TYPE life_cycle;
DROP TYPE layer_type;
DROP TYPE herbaceous_or_woody;
DROP TYPE growth_rate;
--DROP TYPE flower_type;
DROP TYPE fertility;
DROP TYPE external_source;
DROP TYPE deciduous_or_evergreen;

-- Drop extensions
DROP EXTENSION postgis CASCADE;
DROP EXTENSION pg_trgm;
