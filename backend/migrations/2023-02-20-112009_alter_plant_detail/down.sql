-- This file should undo anything in `up.sql`
ALTER TABLE plant_detail DROP COLUMN article_last_modified_at;
ALTER TABLE seeds
  RENAME COLUMN plant_id TO variety_id;
ALTER TABLE seeds
  RENAME CONSTRAINT seeds_plant_id_fkey TO seeds_variety_id_fkey;
ALTER TABLE plants
  RENAME CONSTRAINT plants_pkey TO varieties_pkey;
ALTER TABLE plants
  RENAME COLUMN plant TO variety;