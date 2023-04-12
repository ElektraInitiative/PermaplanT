-- This file should undo anything in `up.sql`
-- rename binomial_name to scientific_name
ALTER TABLE plants
    RENAME COLUMN scientific_name TO binomial_name;
-- rename plant_detail_binomial_name_key to plant_detail_scientific_name_key
ALTER TABLE plants
    RENAME CONSTRAINT plant_detail_scientific_name_key TO plant_detail_binomial_name_key;
-- change type from varchar to text
ALTER TABLE plants
ALTER COLUMN binomial_name TYPE VARCHAR USING binomial_name::VARCHAR;
ALTER TABLE plants
ALTER COLUMN family TYPE VARCHAR USING family::VARCHAR;
ALTER TABLE plants
ALTER COLUMN subfamily TYPE VARCHAR USING subfamily::VARCHAR;
ALTER TABLE plants
ALTER COLUMN genus TYPE VARCHAR USING genus::VARCHAR;
ALTER TABLE plants
ALTER COLUMN edible_uses TYPE VARCHAR USING edible_uses::VARCHAR;
ALTER TABLE plants
ALTER COLUMN medicinal_uses TYPE VARCHAR USING medicinal_uses::VARCHAR;
ALTER TABLE plants
ALTER COLUMN material_uses_and_functions TYPE VARCHAR USING material_uses_and_functions::VARCHAR;
ALTER TABLE plants
ALTER COLUMN botanic TYPE VARCHAR USING botanic::VARCHAR;
ALTER TABLE plants
ALTER COLUMN propagation TYPE VARCHAR USING propagation::VARCHAR;
ALTER TABLE plants
ALTER COLUMN cultivation TYPE VARCHAR USING cultivation::VARCHAR;
ALTER TABLE plants
ALTER COLUMN environment TYPE VARCHAR USING environment::VARCHAR;
ALTER TABLE plants
ALTER COLUMN material_uses TYPE VARCHAR USING material_uses::VARCHAR;
ALTER TABLE plants
ALTER COLUMN functions TYPE VARCHAR USING functions::VARCHAR;
ALTER TABLE plants
ALTER COLUMN provides_forage_for TYPE VARCHAR USING provides_forage_for::VARCHAR;
ALTER TABLE plants
ALTER COLUMN provides_shelter_for TYPE VARCHAR USING provides_shelter_for::VARCHAR;
ALTER TABLE plants
ALTER COLUMN shade TYPE VARCHAR USING shade::VARCHAR;
ALTER TABLE plants
ALTER COLUMN native_climate_zones TYPE VARCHAR USING native_climate_zones::VARCHAR;
ALTER TABLE plants
ALTER COLUMN adapted_climate_zones TYPE VARCHAR USING adapted_climate_zones::VARCHAR;
ALTER TABLE plants
ALTER COLUMN native_geographical_range TYPE VARCHAR USING native_geographical_range::VARCHAR;
ALTER TABLE plants
ALTER COLUMN native_environment TYPE VARCHAR USING native_environment::VARCHAR;
ALTER TABLE plants
ALTER COLUMN ecosystem_niche TYPE VARCHAR USING ecosystem_niche::VARCHAR;
ALTER TABLE plants
ALTER COLUMN pollinators TYPE VARCHAR USING pollinators::VARCHAR;
ALTER TABLE plants
ALTER COLUMN flower_colour TYPE VARCHAR USING flower_colour::VARCHAR;
ALTER TABLE plants
ALTER COLUMN mature_size_height TYPE VARCHAR USING mature_size_height::VARCHAR;
ALTER TABLE plants
ALTER COLUMN mature_size_width TYPE VARCHAR USING mature_size_width::VARCHAR;
ALTER TABLE plants
    RENAME COLUMN common_name_en TO common_name;
-- change hardiness_zone to a range
ALTER TABLE plants
    RENAME COLUMN hardiness_zone TO hardiness_zone_range;
ALTER TABLE plants
ADD COLUMN hardiness_zone smallint CONSTRAINT plant_detail_hardiness_zone_check CHECK (
        (hardiness_zone IS NULL)
        OR (
            (hardiness_zone >= 0)
            AND (hardiness_zone <= 13)
        )
    );
UPDATE plants
SET hardiness_zone = lower(hardiness_zone_range);
ALTER TABLE plants DROP COLUMN hardiness_zone_range;
-- drop propagation column
ALTER TABLE plants
ADD COLUMN propagation text;
