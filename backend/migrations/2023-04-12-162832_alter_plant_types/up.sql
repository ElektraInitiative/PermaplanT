-- Your SQL goes here
-- Hardiness_zone
ALTER TABLE plants
ADD COLUMN new_hardiness_zone TEXT;
ALTER TABLE plants DROP CONSTRAINT plant_detail_hardiness_zone_check;
UPDATE plants
SET new_hardiness_zone = CAST(hardiness_zone AS TEXT);
ALTER TABLE plants DROP COLUMN hardiness_zone;
ALTER TABLE plants
    RENAME COLUMN new_hardiness_zone TO hardiness_zone;
-- Light_requirement
CREATE TYPE LIGHT_REQUIREMENT AS ENUM ('Full sun', 'Partial sun/shade', 'Full shade');
ALTER TABLE plants
ADD COLUMN new_light_requirement LIGHT_REQUIREMENT [];
UPDATE plants
SET new_light_requirement = CASE
        WHEN light_requirement = 'full sun' THEN ARRAY ['Full sun'::LIGHT_REQUIREMENT]
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
-- propagation_method
CREATE TYPE PROPAGATION_METHOD AS ENUM (
    'Seed - direct sow',
    'Seed - transplant',
    'Division',
    'Cuttings',
    'Layering',
    'Spores',
    'Seed'
);
ALTER TABLE plants
ADD COLUMN propagation_method PROPAGATION_METHOD [];
-- growth_rate
ALTER TABLE plants
ALTER COLUMN growth_rate TYPE GROWTH_RATE [] USING ARRAY [growth_rate];
