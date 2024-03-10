-- maps
ALTER TABLE maps
RENAME COLUMN owner_id TO created_by;

ALTER TABLE maps
ADD COLUMN created_at timestamp (0) without time zone,
ADD COLUMN modified_at timestamp (0) without time zone,
ADD COLUMN modified_by uuid;

UPDATE maps
SET
    created_at = date_trunc('day', creation_date) + interval '12:00:00',
    modified_at = date_trunc('day', creation_date) + interval '12:00:00',
    modified_by = created_by;

ALTER TABLE maps
DROP COLUMN creation_date;

ALTER TABLE maps
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN modified_at SET DEFAULT now(),
ALTER COLUMN modified_at SET NOT NULL,
ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN modified_by SET NOT NULL;

-- plantings
ALTER TABLE plantings
ADD COLUMN created_at timestamp (0) without time zone,
ADD COLUMN modified_at timestamp (0) without time zone,
ADD COLUMN created_by uuid,
ADD COLUMN modified_by uuid;

UPDATE plantings
SET
    created_at = maps.created_at,
    modified_at = maps.modified_at,
    created_by = maps.created_by,
    modified_by = maps.created_by
FROM layers
INNER JOIN maps ON layers.map_id = maps.id
WHERE plantings.layer_id = layers.id;

ALTER TABLE plantings
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN modified_at SET DEFAULT now(),
ALTER COLUMN modified_at SET NOT NULL,
ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN modified_by SET NOT NULL,
ALTER COLUMN notes SET DEFAULT '',
ALTER COLUMN notes SET NOT NULL;

-- seeds
ALTER TABLE seeds
RENAME COLUMN owner_id TO created_by;
