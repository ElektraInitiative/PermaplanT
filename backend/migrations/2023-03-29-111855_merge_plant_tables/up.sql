ALTER TABLE seeds DROP COLUMN plant_id;

DROP TABLE plants;

ALTER TABLE plant_detail RENAME TO plants;
ALTER TABLE seeds ADD COLUMN plant_id INTEGER REFERENCES plants(id);
