-- This file should undo anything in `up.sql`
ALTER TABLE plants DROP COLUMN alternate_name;
ALTER TABLE plants DROP COLUMN diseases;
ALTER TABLE plants DROP COLUMN edible;
ALTER TABLE plants DROP COLUMN edible_parts;
ALTER TABLE plants DROP COLUMN germination_temperature;
ALTER TABLE plants DROP COLUMN introduced_into;
ALTER TABLE plants DROP COLUMN habitus;
ALTER TABLE plants DROP COLUMN leaves;
ALTER TABLE plants DROP COLUMN medicinal_parts;
ALTER TABLE plants DROP COLUMN native_to;
ALTER TABLE plants DROP COLUMN plants_for_a_future;
ALTER TABLE plants DROP COLUMN plants_of_the_world_online_link;
ALTER TABLE plants DROP COLUMN plants_of_the_world_online_link_synonym;
ALTER TABLE plants DROP COLUMN pollination;
ALTER TABLE plants DROP COLUMN propagation_transplanting;
ALTER TABLE plants DROP COLUMN resistance;
ALTER TABLE plants DROP COLUMN root_type;
ALTER TABLE plants DROP COLUMN seed_planting_depth_en;
ALTER TABLE plants DROP COLUMN seed_viability;
ALTER TABLE plants DROP COLUMN slug;
ALTER TABLE plants DROP COLUMN spread;
ALTER TABLE plants DROP COLUMN utility;
ALTER TABLE plants DROP COLUMN warning;
ALTER TABLE plants DROP COLUMN when_to_plant_cuttings;
ALTER TABLE plants DROP COLUMN when_to_plant_division;
ALTER TABLE plants DROP COLUMN when_to_plant_transplant;
ALTER TABLE plants DROP COLUMN when_to_sow_indoors;
ALTER TABLE plants DROP COLUMN sowing_outdoors_en;
ALTER TABLE plants DROP COLUMN when_to_start_indoors_weeks;
ALTER TABLE plants DROP COLUMN when_to_start_outdoors_weeks;
ALTER TABLE plants DROP COLUMN spacing_en;
ALTER TABLE plants DROP COLUMN habitat;
ALTER TABLE plants DROP COLUMN days_to_harvest;
ALTER TABLE plants DROP COLUMN cold_stratification_time;
ALTER TABLE plants DROP COLUMN cold_stratification_temperature;
ALTER TABLE plants DROP COLUMN wikipedia;
ALTER TABLE plants DROP COLUMN days_to_maturity;
ALTER TABLE plants DROP COLUMN pests;
ALTER TABLE plants DROP COLUMN version;
ALTER TABLE plants DROP COLUMN germination_time;
ALTER TABLE plants DROP COLUMN description;
ALTER TABLE plants DROP COLUMN parent_id;
ALTER TABLE plants DROP COLUMN external_source;
ALTER TABLE plants DROP COLUMN external_id;
ALTER TABLE plants DROP COLUMN external_url;
DROP TYPE EXTERNAL_SOURCE;
CREATE TYPE ROOT_ZONE_TENDANCY AS ENUM ('surface', 'shallow', 'deep');
ALTER TABLE plants
ADD COLUMN root_zone_tendancy ROOT_ZONE_TENDANCY;
UPDATE plants
SET root_zone_tendancy = CASE
        WHEN root_depth LIKE '%surface%' THEN 'surface'::ROOT_ZONE_TENDANCY
        WHEN root_depth LIKE '%shallow%' THEN 'shallow'::ROOT_ZONE_TENDANCY
        WHEN root_depth LIKE '%deep%' THEN 'deep'::ROOT_ZONE_TENDANCY
        ELSE NULL
    END;
ALTER TABLE plants DROP COLUMN root_depth;
