-- This file should undo anything in `up.sql`
-- hardiness_zone
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
-- Light_requirement
CREATE TYPE SUN AS ENUM ('full sun', 'partial sun', 'indirect sun');
ALTER TABLE plants
ADD COLUMN new_light_requirement SUN;
UPDATE plants
SET new_light_requirement = CASE
        WHEN light_requirement = ARRAY ['Full sun'::LIGHT_REQUIREMENT] THEN 'full sun'::SUN
        WHEN light_requirement = ARRAY ['Partial sun/shade'::LIGHT_REQUIREMENT] THEN 'partial sun'::SUN
        WHEN light_requirement = ARRAY ['Full shade'::LIGHT_REQUIREMENT] THEN 'indirect sun'::SUN
        ELSE NULL
    END;
ALTER TABLE plants DROP COLUMN light_requirement;
ALTER TABLE plants
    RENAME COLUMN new_light_requirement TO light_requirement;
DROP TYPE LIGHT_REQUIREMENT;
-- Water_requirement
CREATE TYPE WATER AS ENUM ('low', 'moderate', 'high', 'aquatic');
ALTER TABLE plants
ADD COLUMN new_water_requirement WATER;
UPDATE plants
SET new_water_requirement = CASE
        WHEN water_requirement = ARRAY ['Dry'::WATER_REQUIREMENT] THEN 'low'::WATER
        WHEN water_requirement = ARRAY ['Moist'::WATER_REQUIREMENT] THEN 'moderate'::WATER
        WHEN water_requirement = ARRAY ['Wet'::WATER_REQUIREMENT] THEN 'high'::WATER
        WHEN water_requirement = ARRAY ['Water'::WATER_REQUIREMENT] THEN 'aquatic'::WATER
        ELSE NULL
    END;
ALTER TABLE plants DROP COLUMN water_requirement;
ALTER TABLE plants
    RENAME COLUMN new_water_requirement TO water_requirement;
DROP TYPE WATER_REQUIREMENT;
-- propagation_method
ALTER TABLE plants DROP COLUMN propagation_method;
DROP TYPE PROPAGATION_METHOD;
