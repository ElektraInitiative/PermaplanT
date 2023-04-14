-- Your SQL goes here
ALTER TABLE plants
ALTER COLUMN unique_name TYPE TEXT USING unique_name::TEXT;
ALTER TABLE plants
ALTER COLUMN family TYPE TEXT USING family::TEXT;
ALTER TABLE plants
ALTER COLUMN subfamily TYPE TEXT USING subfamily::TEXT;
ALTER TABLE plants
ALTER COLUMN genus TYPE TEXT USING genus::TEXT;
ALTER TABLE plants
ALTER COLUMN edible_uses_en TYPE TEXT USING edible_uses_en::TEXT;
ALTER TABLE plants
ALTER COLUMN medicinal_uses TYPE TEXT USING medicinal_uses::TEXT;
ALTER TABLE plants
ALTER COLUMN material_uses_and_functions TYPE TEXT USING material_uses_and_functions::TEXT;
ALTER TABLE plants
ALTER COLUMN botanic TYPE TEXT USING botanic::TEXT;
ALTER TABLE plants
ALTER COLUMN cultivation TYPE TEXT USING cultivation::TEXT;
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
ALTER COLUMN height TYPE TEXT USING height::TEXT;
ALTER TABLE plants
ALTER COLUMN width TYPE TEXT USING width::TEXT;
