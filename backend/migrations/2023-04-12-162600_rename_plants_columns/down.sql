-- This file should undo anything in `up.sql`
ALTER TABLE plants
    RENAME COLUMN unique_name TO binomial_name;
ALTER TABLE plants
    RENAME CONSTRAINT plant_unique_name_key TO plant_detail_binomial_name_key;
ALTER TABLE plants
    RENAME COLUMN light_requirement TO sun;
ALTER TABLE plants
    RENAME COLUMN common_name_en TO common_name;
ALTER TABLE plants
ADD COLUMN propagation VARCHAR;
ALTER TABLE plants
    RENAME column water_requirement TO water;
ALTER TABLE plants
    RENAME column height TO mature_size_height;
ALTER TABLE plants
    RENAME column width TO mature_size_width;
ALTER TABLE plants
    RENAME column edible_uses_en TO edible_uses;
ALTER TABLE plants
ADD COLUMN environment VARCHAR;
