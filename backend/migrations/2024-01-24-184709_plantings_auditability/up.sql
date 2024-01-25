ALTER TABLE plantings
ADD COLUMN created_at timestamp without time zone,
ADD COLUMN modified_at timestamp without time zone,
ADD COLUMN created_by uuid,
ADD COLUMN modified_by uuid;

UPDATE plantings
SET
    created_at = date_trunc('day', maps.creation_date) + interval '12:00:00',
    modified_at = date_trunc('day', maps.creation_date) + interval '12:00:00',
    created_by = maps.owner_id,
    modified_by = maps.owner_id
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
    ALTER COLUMN remove_date SET DEFAULT NULL,
    ALTER COLUMN notes SET DEFAULT '',
    ALTER COLUMN notes SET NOT NULL;
