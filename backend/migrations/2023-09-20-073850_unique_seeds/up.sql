-- Users should not be able to have two seeds with the exact same name and plant.
ALTER TABLE seeds
ADD CONSTRAINT unique_seeds
UNIQUE (owner_id, plant_id, name);

-- Make sure the user can't enter names with - or ' in the name, as this could cause confusion
-- when seeds are displayed with their full name.
ALTER TABLE seeds
ADD CONSTRAINT seeds_disallow_confusing_characters
CHECK (name ~ '^(?!.*(\-|\'')).*$'); -- '' is the escape sequence for a single quote in SQL
