-- Your SQL goes here
CREATE TYPE EXTERNAL_SOURCE as ENUM ('practicalplants', 'permapeople', 'reinsaat');
ALTER TABLE plants
ADD COLUMN alternate_name TEXT,
    ADD COLUMN diseases TEXT,
    ADD COLUMN edible BOOLEAN,
    ADD COLUMN edible_parts TEXT [],
    ADD COLUMN germination_temperature TEXT,
    ADD COLUMN introduced_into TEXT,
    ADD COLUMN habitus TEXT,
    ADD COLUMN medicinal_parts TEXT,
    ADD COLUMN native_to TEXT,
    ADD COLUMN plants_for_a_future TEXT,
    ADD COLUMN plants_of_the_world_online_link TEXT,
    ADD COLUMN plants_of_the_world_online_link_synonym TEXT,
    ADD COLUMN pollination TEXT,
    ADD COLUMN propagation_transplanting TEXT,
    ADD COLUMN resistance TEXT,
    ADD COLUMN root_type TEXT,
    ADD COLUMN seed_planting_depth_en TEXT,
    ADD COLUMN seed_viability TEXT,
    ADD COLUMN slug TEXT,
    ADD COLUMN spread TEXT,
    ADD COLUMN utility TEXT,
    ADD COLUMN warning TEXT,
    ADD COLUMN when_to_plant_cuttings TEXT,
    ADD COLUMN when_to_plant_division TEXT,
    ADD COLUMN when_to_plant_transplant TEXT,
    ADD COLUMN when_to_sow_indoors TEXT,
    ADD COLUMN sowing_outdoors_en TEXT,
    ADD COLUMN when_to_start_indoors_weeks TEXT,
    ADD COLUMN when_to_start_outdoors_weeks TEXT,
    ADD COLUMN cold_stratification_temperature TEXT,
    ADD COLUMN cold_stratification_time TEXT,
    ADD COLUMN days_to_harvest text,
    ADD COLUMN habitat text,
    ADD COLUMN spacing_en text,
    ADD COLUMN wikipedia_url TEXT,
    ADD COLUMN days_to_maturity TEXT,
    ADD COLUMN pests TEXT,
    ADD COLUMN version TEXT,
    ADD COLUMN germination_time TEXT,
    ADD COLUMN description TEXT,
    ADD COLUMN parent_id TEXT,
    ADD COLUMN external_source EXTERNAL_SOURCE,
    ADD COLUMN external_id TEXT,
    ADD COLUMN external_url TEXT;
ALTER TABLE plants
ADD COLUMN root_depth TEXT;
UPDATE plants
SET root_depth = CAST (root_zone_tendancy as TEXT);
ALTER TABLE plants DROP COLUMN root_zone_tendancy;
DROP TYPE ROOT_ZONE_TENDANCY;
