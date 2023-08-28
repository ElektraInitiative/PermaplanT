-- This SQL script will migrate some of the data in plant detail over to the plants table.
-- TODO: automatically perform these actions after the data is put plant detail.
BEGIN TRANSACTION;
ALTER TABLE plants ALTER COLUMN tags DROP NOT NULL;
INSERT INTO plants (species, plant, plant_type) SELECT
binomial_name,
common_name[1],
id
FROM plant_detail;
UPDATE plants SET tags = ARRAY[]::TEXT [];
ALTER TABLE plants ALTER COLUMN tags SET NOT NULL;
COMMIT;
