-- Users should not be able to have two seeds with the exact same name and plant.
ALTER TABLE seeds
ADD CONSTRAINT unique_seeds
UNIQUE (owner_id, plant_id, name);

-- Make sure the user can't enter names with '-' in the name, as this could cause confusion
-- when seeds are displayed with their full name.
-- A seed name must also contain at least one character or digit from the English or German alphabet.
ALTER TABLE seeds
ADD CONSTRAINT restrict_seed_name
CHECK (name ~ '^(?!.*(\-))(?=.*[a-zA-Z0-9äöüÄÖÜß]).*$');
