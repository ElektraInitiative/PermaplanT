-- Your SQL goes here
-- hardiness_zone
ALTER TABLE plants
ADD COLUMN hardiness_zone_range INT4RANGE;
UPDATE plants
SET hardiness_zone_range = int4range(hardiness_zone, hardiness_zone, '[]');
ALTER TABLE plants DROP COLUMN hardiness_zone;
ALTER TABLE plants
    RENAME COLUMN hardiness_zone_range TO hardiness_zone;
-- Light_requirement
CREATE TYPE LIGHT_REQUIREMENT AS ENUM ('Full Sun', 'Partial sun/shade', 'Full shade');
ALTER TABLE plants
ADD COLUMN new_light_requirement LIGHT_REQUIREMENT [];
UPDATE plants
SET new_light_requirement = CASE
        WHEN light_requirement = 'full sun' THEN ARRAY ['Full Sun'::LIGHT_REQUIREMENT]
        WHEN light_requirement = 'partial sun' THEN ARRAY ['Partial sun/shade'::LIGHT_REQUIREMENT]
        WHEN light_requirement = 'indirect sun' THEN ARRAY ['Full shade'::LIGHT_REQUIREMENT]
        ELSE NULL
    END;
ALTER TABLE plants DROP COLUMN light_requirement;
ALTER TABLE plants
    RENAME COLUMN new_light_requirement TO light_requirement;
DROP TYPE SUN;
-- Water_requirement
CREATE TYPE WATER_REQUIREMENT AS ENUM ('Dry', 'Moist', 'Wet', 'Water');
ALTER TABLE plants
ADD COLUMN new_water_requirement WATER_REQUIREMENT [];
UPDATE plants
SET new_water_requirement = CASE
        WHEN water_requirement = 'low' THEN ARRAY ['Dry'::WATER_REQUIREMENT]
        WHEN water_requirement = 'moderate' THEN ARRAY ['Moist'::WATER_REQUIREMENT]
        WHEN water_requirement = 'high' THEN ARRAY ['Wet'::WATER_REQUIREMENT]
        WHEN water_requirement = 'aquatic' THEN ARRAY ['Water'::WATER_REQUIREMENT]
        ELSE NULL
    END;
ALTER TABLE plants DROP COLUMN water_requirement;
ALTER TABLE plants
    RENAME COLUMN new_water_requirement TO water_requirement;
DROP TYPE WATER;
