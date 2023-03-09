-- This file should undo anything in `up.sql`
DROP TABLE IF EXISTS genus;
DROP TABLE IF EXISTS subfamily;
DROP TABLE IF EXISTS family;
ALTER TABLE plant_detail DROP CONSTRAINT plant_detail_family_id_fkey;
ALTER TABLE plant_detail DROP COLUMN family_id;
ALTER TABLE plant_detail DROP CONSTRAINT plant_detail_subfamily_id_fkey;
ALTER TABLE plant_detail DROP COLUMN subfamily_id;
ALTER TABLE plant_detail DROP CONSTRAINT plant_detail_genus_id_fkey;
ALTER TABLE plant_detail DROP COLUMN genus_id;
DROP TYPE IF EXISTS LIKE_TYPE;