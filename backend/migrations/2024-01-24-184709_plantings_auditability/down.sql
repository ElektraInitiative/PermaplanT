-- seeds
ALTER TABLE seeds
RENAME COLUMN created_by TO owner_id;

-- plantings
ALTER TABLE plantings
DROP COLUMN created_at,
DROP COLUMN modified_at,
DROP COLUMN created_by,
DROP COLUMN modified_by;

ALTER TABLE plantings
ALTER COLUMN notes DROP NOT NULL,
ALTER COLUMN notes DROP DEFAULT;

-- maps
ALTER TABLE maps
ADD COLUMN creation_date date;

UPDATE maps
SET
    creation_date = created_at;

ALTER TABLE maps
DROP COLUMN created_at,
DROP COLUMN modified_at,
DROP COLUMN modified_by;

ALTER TABLE maps
RENAME COLUMN created_by TO owner_id;

ALTER TABLE maps
ALTER COLUMN creation_date SET NOT NULL;
