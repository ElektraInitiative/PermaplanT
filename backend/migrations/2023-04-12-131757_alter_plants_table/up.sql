-- Your SQL goes here
-- rename binomial_name to scientific_name
ALTER TABLE plants
    RENAME COLUMN binomial_name TO scientific_name;
-- rename plant_detail_binomial_name_key to plant_detail_scientific_name_key
ALTER TABLE plants
    RENAME CONSTRAINT plant_detail_binomial_name_key TO plant_detail_scientific_name_key;
ALTER TABLE plants
ALTER COLUMN scientific_name TYPE TEXT USING scientific_name::TEXT;
-- change type from varchar to text
ALTER TABLE plants
ALTER COLUMN family TYPE TEXT USING family::TEXT;
ALTER TABLE plants
ALTER COLUMN subfamily TYPE TEXT USING subfamily::TEXT;
ALTER TABLE plants
ALTER COLUMN genus TYPE TEXT USING genus::TEXT;
ALTER TABLE plants
ALTER COLUMN edible_uses TYPE TEXT USING edible_uses::TEXT;
ALTER TABLE plants
ALTER COLUMN medicinal_uses TYPE TEXT USING medicinal_uses::TEXT;
ALTER TABLE plants
ALTER COLUMN material_uses_and_functions TYPE TEXT USING material_uses_and_functions::TEXT;
ALTER TABLE plants
ALTER COLUMN botanic TYPE TEXT USING botanic::TEXT;
ALTER TABLE plants
ALTER COLUMN propagation TYPE TEXT USING propagation::TEXT;
ALTER TABLE plants
ALTER COLUMN cultivation TYPE TEXT USING cultivation::TEXT;
ALTER TABLE plants
ALTER COLUMN environment TYPE TEXT USING environment::TEXT;
ALTER TABLE plants
ALTER COLUMN material_uses TYPE TEXT USING material_uses::TEXT;
ALTER TABLE plants
ALTER COLUMN functions TYPE TEXT USING functions::TEXT;
ALTER TABLE plants
ALTER COLUMN provides_forage_for TYPE TEXT USING provides_forage_for::TEXT;
ALTER TABLE plants
ALTER COLUMN provides_shelter_for TYPE TEXT USING provides_shelter_for::TEXT;
ALTER TABLE plants
ALTER COLUMN shade TYPE TEXT USING shade::TEXT;
ALTER TABLE plants
ALTER COLUMN native_climate_zones TYPE TEXT USING native_climate_zones::TEXT;
ALTER TABLE plants
ALTER COLUMN adapted_climate_zones TYPE TEXT USING adapted_climate_zones::TEXT;
ALTER TABLE plants
ALTER COLUMN native_geographical_range TYPE TEXT USING native_geographical_range::TEXT;
ALTER TABLE plants
ALTER COLUMN native_environment TYPE TEXT USING native_environment::TEXT;
ALTER TABLE plants
ALTER COLUMN ecosystem_niche TYPE TEXT USING ecosystem_niche::TEXT;
ALTER TABLE plants
ALTER COLUMN pollinators TYPE TEXT USING pollinators::TEXT;
ALTER TABLE plants
ALTER COLUMN flower_colour TYPE TEXT USING flower_colour::TEXT;
ALTER TABLE plants
ALTER COLUMN mature_size_height TYPE TEXT USING mature_size_height::TEXT;
ALTER TABLE plants
ALTER COLUMN mature_size_width TYPE TEXT USING mature_size_width::TEXT;
ALTER TABLE plants
    RENAME COLUMN common_name TO common_name_en;
-- change hardiness_zone to a range
ALTER TABLE plants
ADD COLUMN hardiness_zone_range int4range;
UPDATE plants
SET hardiness_zone_range = int4range(hardiness_zone, hardiness_zone, '[]');
ALTER TABLE plants DROP COLUMN hardiness_zone;
ALTER TABLE plants
    RENAME COLUMN hardiness_zone_range TO hardiness_zone;
-- drop propagation column
ALTER TABLE plants DROP COLUMN propagation;
