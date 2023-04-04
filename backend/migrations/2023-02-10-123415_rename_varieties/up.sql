-- Your SQL goes here
ALTER TABLE varieties
  RENAME TO plants;
ALTER TABLE plants
ADD COLUMN plant_type INTEGER REFERENCES plant_detail (id);
