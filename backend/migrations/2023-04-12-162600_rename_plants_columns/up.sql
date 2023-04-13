-- Your SQL goes here
ALTER TABLE plants
    RENAME COLUMN binomial_name TO scientific_name;
ALTER TABLE plants
    RENAME CONSTRAINT plant_detail_binomial_name_key TO plant_detail_scientific_name_key;
ALTER TABLE plants
    RENAME COLUMN sun TO light_requirement;
ALTER TABLE plants
    RENAME COLUMN common_name TO common_name_en;
ALTER TABLE plants DROP COLUMN propagation;
ALTER TABLE plants
    RENAME column water TO water_requirement;
ALTER TABLE plants
    RENAME column mature_size_height TO height;
ALTER TABLE plants
    RENAME column growth_rate TO growth;
ALTER TABLE plants
    RENAME column mature_size_width TO width;
