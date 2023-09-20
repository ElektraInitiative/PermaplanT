ALTER TABLE seeds
ADD CONSTRAINT unique_seeds
UNIQUE (owner_id, plant_id, name);
