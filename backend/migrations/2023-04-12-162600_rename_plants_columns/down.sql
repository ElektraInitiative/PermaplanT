-- This file should undo anything in `up.sql`
ALTER TABLE plants
    RENAME COLUMN scientific_name TO binomial_name;
ALTER TABLE plants
    RENAME CONSTRAINT plant_detail_scientific_name_key TO plant_detail_binomial_name_key;
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
    RENAME column growth TO growth_rate;
