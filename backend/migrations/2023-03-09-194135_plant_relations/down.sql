-- This file should undo anything in `up.sql`
ALTER TABLE plant_detail DROP CONSTRAINT plant_detail_family_fkey;
ALTER TABLE plant_detail DROP CONSTRAINT plant_detail_subfamily_fkey;
ALTER TABLE plant_detail DROP CONSTRAINT plant_detail_genus_fkey;
DROP TABLE IF EXISTS genus;
DROP TABLE IF EXISTS subfamily;
DROP TABLE IF EXISTS family;
DROP TABLE IF EXISTS relations;
DROP TYPE IF EXISTS RELATION_TYPE;
DROP TYPE IF EXISTS HIERARCHY_LEVEL_TYPE;