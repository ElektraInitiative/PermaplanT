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
-- growth
CREATE TYPE GROWTH AS ENUM ('Slow', 'Medium', 'Fast');
ALTER TABLE plants
ADD COLUMN new_growth GROWTH [];
UPDATE plants
SET new_growth = CASE
        WHEN growth = 'slow' THEN ARRAY ['Slow'::GROWTH]
        WHEN growth = 'moderate' THEN ARRAY ['Medium'::GROWTH]
        WHEN growth = 'vigorous' THEN ARRAY ['Fast'::GROWTH]
        ELSE NULL
    END;
ALTER TABLE plants DROP COLUMN growth;
ALTER TABLE plants
    RENAME COLUMN new_growth TO growth;
DROP TYPE GROWTH_RATE;
