CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

CREATE OR REPLACE FUNCTION copy_layer_and_plantings(old_layer_id integer)
RETURNS integer AS $$
DECLARE
    new_layer_id integer;
BEGIN
    -- Copy layer
    INSERT INTO layers (map_id, type, name, is_alternative)
    SELECT map_id, type, name || ' (Copy)', true
    FROM layers
    WHERE id = old_layer_id
    RETURNING id INTO new_layer_id;

    -- Copy plantings
    INSERT INTO plantings (id, layer_id, plant_id, x, y, width, height, rotation, scale_x, scale_y, add_date, remove_date)
    SELECT gen_random_uuid(), new_layer_id, plant_id, x, y, width, height, rotation, scale_x, scale_y, add_date, remove_date
    FROM plantings
    WHERE layer_id = old_layer_id;

    -- Return the new layer id
    RETURN new_layer_id;
END;
$$ LANGUAGE plpgsql;
