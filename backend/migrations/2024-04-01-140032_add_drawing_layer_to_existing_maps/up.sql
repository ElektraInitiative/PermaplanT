INSERT INTO layers (map_id, "type", "name", is_alternative)
SELECT
    m.id AS map_id,
    'drawing' AS layer_type,
    'Drawing Layer' AS layer_name,
    false AS is_alternative
FROM maps AS m
WHERE NOT EXISTS (SELECT 1 FROM layers AS l WHERE l.map_id = m.id AND l."type" = 'drawing');
