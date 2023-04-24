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
CREATE TYPE LIGHT_REQUIREMENT AS ENUM ('full sun', 'partial sun/shade', 'full shade');
ALTER TABLE plants
ADD COLUMN new_light_requirement LIGHT_REQUIREMENT [];
UPDATE plants
SET new_light_requirement = CASE
        WHEN light_requirement = 'full sun' THEN ARRAY ['full sun'::LIGHT_REQUIREMENT]
        WHEN light_requirement = 'partial sun' THEN ARRAY ['partial sun/shade'::LIGHT_REQUIREMENT]
        WHEN light_requirement = 'indirect sun' THEN ARRAY ['full shade'::LIGHT_REQUIREMENT]
        ELSE NULL
    END;
ALTER TABLE plants DROP COLUMN light_requirement;
ALTER TABLE plants
    RENAME COLUMN new_light_requirement TO light_requirement;
DROP TYPE SUN;
-- Water_requirement
CREATE TYPE WATER_REQUIREMENT AS ENUM ('dry', 'moist', 'wet', 'water');
ALTER TABLE plants
ADD COLUMN new_water_requirement WATER_REQUIREMENT [];
UPDATE plants
SET new_water_requirement = CASE
        WHEN water_requirement = 'low' THEN ARRAY ['dry'::WATER_REQUIREMENT]
        WHEN water_requirement = 'moderate' THEN ARRAY ['moist'::WATER_REQUIREMENT]
        WHEN water_requirement = 'high' THEN ARRAY ['wet'::WATER_REQUIREMENT]
        WHEN water_requirement = 'aquatic' THEN ARRAY ['water'::WATER_REQUIREMENT]
        ELSE NULL
    END;
ALTER TABLE plants DROP COLUMN water_requirement;
ALTER TABLE plants
    RENAME COLUMN new_water_requirement TO water_requirement;
DROP TYPE WATER;
-- propagation_method
CREATE TYPE PROPAGATION_METHOD AS ENUM (
    'seed - direct sow',
    'seed - transplant',
    'division',
    'cuttings',
    'layering',
    'spores',
    'seed'
);
ALTER TABLE plants
ADD COLUMN propagation_method PROPAGATION_METHOD [];
-- growth_rate
ALTER TABLE plants
ALTER COLUMN growth_rate TYPE GROWTH_RATE [] USING ARRAY [growth_rate];
ALTER TABLE plants DROP COLUMN provides_forage_for;
ALTER TABLE plants DROP COLUMN provides_shelter_for;
ALTER TABLE plants DROP COLUMN cultivation;
ALTER TABLE plants DROP COLUMN native_climate_zones;
ALTER TABLE plants DROP COLUMN adapted_climate_zones;
ALTER TABLE plants DROP COLUMN subfamily;
ALTER TABLE plants DROP COLUMN pollinators;
ALTER TABLE plants
ALTER COLUMN shade TYPE SHADE USING shade::SHADE;
