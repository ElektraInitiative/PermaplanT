-- Your SQL goes here
ALTER TABLE plant_detail
ADD COLUMN article_last_modified_at TIMESTAMP;
ALTER TABLE seeds
  RENAME COLUMN variety_id TO plant_id;
ALTER TABLE seeds
  RENAME CONSTRAINT seeds_variety_id_fkey TO seeds_plant_id_fkey;
ALTER TABLE plants
  RENAME CONSTRAINT varieties_pkey TO plants_pkey;
ALTER TABLE plants
  RENAME COLUMN variety TO plant;