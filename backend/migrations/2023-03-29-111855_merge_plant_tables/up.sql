ALTER TABLE seeds DROP COLUMN plant_id;

DROP TABLE plants;

ALTER TABLE plant_detail RENAME TO plants;
ALTER TABLE seeds ADD COLUMN plant_id INTEGER REFERENCES plants(id);

INSERT INTO plants (id, binomial_name, common_name) VALUES (-1, 'Testia testia', ARRAY['Testplant']);
