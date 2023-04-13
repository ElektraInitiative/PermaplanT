-- This file should undo anything in `up.sql`
ALTER TABLE plants
ALTER COLUMN scientific_name TYPE VARCHAR USING scientific_name::VARCHAR;
ALTER TABLE plants
ALTER COLUMN family TYPE VARCHAR USING family::VARCHAR;
ALTER TABLE plants
ALTER COLUMN subfamily TYPE VARCHAR USING subfamily::VARCHAR;
ALTER TABLE plants
ALTER COLUMN genus TYPE VARCHAR USING genus::VARCHAR;
ALTER TABLE plants
ALTER COLUMN edible_uses_en TYPE VARCHAR USING edible_uses_en::VARCHAR;
ALTER TABLE plants
ALTER COLUMN medicinal_uses TYPE VARCHAR USING medicinal_uses::VARCHAR;
ALTER TABLE plants
ALTER COLUMN material_uses_and_functions TYPE VARCHAR USING material_uses_and_functions::VARCHAR;
ALTER TABLE plants
ALTER COLUMN botanic TYPE VARCHAR USING botanic::VARCHAR;
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
ALTER COLUMN height TYPE VARCHAR USING height::VARCHAR;
ALTER TABLE plants
ALTER COLUMN width TYPE VARCHAR USING width::VARCHAR;
