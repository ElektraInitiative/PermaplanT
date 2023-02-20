-- This file should undo anything in `up.sql`
ALTER TABLE IF EXISTS plant_detail DROP CONSTRAINT IF EXISTS plant_detail_species_fkey;
ALTER TABLE IF EXISTS plant_detail DROP COLUMN IF EXISTS species;
ALTER TABLE IF EXISTS species DROP CONSTRAINT IF EXISTS plant_detail_genus_fkey;
ALTER TABLE IF EXISTS species DROP COLUMN IF EXISTS genus_id;
DROP TABLE IF EXISTS species;
ALTER TABLE IF EXISTS genus DROP CONSTRAINT IF EXISTS plant_detail_subfamily_fkey;
ALTER TABLE IF EXISTS genus DROP COLUMN IF EXISTS subfamily_id;
DROP TABLE IF EXISTS genus;
ALTER TABLE IF EXISTS subfamily DROP CONSTRAINT IF EXISTS plant_detail_family_fkey;
ALTER TABLE IF EXISTS subfamily DROP COLUMN IF EXISTS family_id;
DROP TABLE IF EXISTS subfamily;
DROP TABLE IF EXISTS family;