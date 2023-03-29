ALTER TABLE plants RENAME TO plant_detail;

CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  tags TEXT[] NOT NULL,
  species TEXT NOT NULL,
  plant TEXT,
  plant_type INTEGER REFERENCES plant_detail (id)
);

ALTER TABLE seeds DROP COLUMN plant_id;
ALTER TABLE seeds ADD COLUMN plant_id INTEGER REFERENCES plants(id); 
