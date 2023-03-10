UPDATE seeds SET plant_id=(SELECT id FROM plants LIMIT 1) WHERE plant_id IS NULL; 

ALTER TABLE seeds ALTER COLUMN plant_id SET NOT NULL;
