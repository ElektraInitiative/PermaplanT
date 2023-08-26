INSERT INTO layers (map_id, type, name, is_alternative)
SELECT
    maps_without_shade_layer.id AS map_id,
    'shade' AS type, -- noqa: RF04
    -- Use an extra space to identify shade layers that were added using this migration script
    -- so that the changes can be undone if necessary.
    'Shade Layer ' AS name, -- noqa: RF04
    false AS is_alternative
FROM (
    SELECT maps.id AS id
    FROM maps

    EXCEPT

    SELECT maps.id
    FROM maps
    LEFT JOIN layers ON layers.map_id = maps.id
    WHERE layers.type = 'shade'
) AS maps_without_shade_layer;
