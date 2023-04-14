-- Your SQL goes here
ALTER TABLE plants
ADD COLUMN alternate_name TEXT;
ALTER TABLE plants
ADD COLUMN diseases TEXT;
ALTER TABLE plants
ADD COLUMN edible BOOLEAN;
ALTER TABLE plants
ADD COLUMN edible_parts TEXT [];
ALTER TABLE plants
ADD COLUMN germination_temperature INTEGER;
ALTER TABLE plants
ADD COLUMN introduced_into TEXT;
ALTER TABLE plants
ADD COLUMN layer TEXT;
ALTER TABLE plants
ADD COLUMN leaves TEXT;
ALTER TABLE plants
ADD COLUMN link TEXT;
ALTER TABLE plants
ADD COLUMN medicinal_parts TEXT;
ALTER TABLE plants
ADD COLUMN native_to TEXT;
ALTER TABLE plants
ADD COLUMN plants_for_a_future TEXT;
ALTER TABLE plants
ADD COLUMN plants_of_the_world_online_link TEXT;
ALTER TABLE plants
ADD COLUMN plants_of_the_world_online_link_synonym TEXT;
ALTER TABLE plants
ADD COLUMN pollination TEXT;
ALTER TABLE plants
ADD COLUMN propagation_transplanting TEXT;
ALTER TABLE plants
ADD COLUMN resistance TEXT;
ALTER TABLE plants
ADD COLUMN root_depth TEXT;
ALTER TABLE plants
ADD COLUMN root_type TEXT;
ALTER TABLE plants
ADD COLUMN seed_planting_depth_en TEXT;
ALTER TABLE plants
ADD COLUMN seed_viability TEXT;
ALTER TABLE plants
ADD COLUMN slug TEXT;
ALTER TABLE plants
ADD COLUMN spread TEXT;
ALTER TABLE plants
ADD COLUMN thining TEXT;
ALTER TABLE plants
ADD COLUMN utility TEXT;
ALTER TABLE plants
ADD COLUMN warning TEXT;
ALTER TABLE plants
ADD COLUMN when_to_plant_cuttings TEXT;
ALTER TABLE plants
ADD COLUMN when_to_plant_division TEXT;
ALTER TABLE plants
ADD COLUMN when_to_plant_transplant TEXT;
ALTER TABLE plants
ADD COLUMN when_to_sow_indoors TEXT;
ALTER TABLE plants
ADD COLUMN sowing_outdoors_en TEXT;
ALTER TABLE plants
ADD COLUMN when_to_start_indoors_weeks TEXT;
ALTER TABLE plants
ADD COLUMN when_to_start_outdoors_weeks TEXT;
ALTER TABLE plants
ADD COLUMN cold_stratification_temperature integer;
ALTER TABLE plants
ADD COLUMN cold_stratification_time integer;
ALTER TABLE plants
ADD COLUMN days_to_harvest text;
ALTER TABLE plants
ADD COLUMN habitat text;
ALTER TABLE plants
ADD COLUMN spacing_en text;
ALTER TABLE plants
ADD COLUMN wikipedia TEXT;
ALTER TABLE plants
ADD COLUMN days_to_maturity TEXT;
ALTER TABLE plants
ADD COLUMN pests TEXT;
ALTER TABLE plants
ADD COLUMN version TEXT;
ALTER TABLE plants
ADD COLUMN germination_time TEXT;
ALTER TABLE plants
ADD COLUMN description TEXT;
