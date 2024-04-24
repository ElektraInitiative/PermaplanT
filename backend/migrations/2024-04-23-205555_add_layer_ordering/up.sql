ALTER TABLE layers
ADD COLUMN order_index int4;

UPDATE layers
SET order_index = subquery.row_number
FROM (
    SELECT
        id,
        row_number() OVER (PARTITION BY map_id ORDER BY id) AS row_number
    FROM layers
) AS subquery
WHERE layers.id = subquery.id;

ALTER TABLE layers
ALTER COLUMN order_index SET NOT NULL;
