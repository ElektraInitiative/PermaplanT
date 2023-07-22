-- Your SQL goes here
CREATE TABLE shadings (
    id uuid PRIMARY KEY,
    layer_id integer NOT NULL,
    shade shade NOT NULL,
    geometry GEOMETRY (POLYGON, 4326) NOT NULL,
    add_date date,
    remove_date date,
    FOREIGN KEY (layer_id) REFERENCES layers (id) ON DELETE CASCADE
);

CREATE FUNCTION check_shade_layer_type() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF (SELECT type FROM layers WHERE id = NEW.layer_id) != 'shade' THEN
        RAISE EXCEPTION 'Layer type must be "shade"';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER check_shade_layer_type_before_insert_or_update
BEFORE INSERT OR UPDATE ON shadings
FOR EACH ROW EXECUTE FUNCTION check_shade_layer_type();

-- Calculate a score for a certain position.
-- p_layer_ids[1] ... plant layer
-- p_layer_ids[2] ... shade layer
CREATE OR REPLACE FUNCTION calculate_score(
    p_map_id integer,
    p_layer_ids integer [],
    p_plant_id integer,
    x_pos integer,
    y_pos integer
)
RETURNS real AS $$
DECLARE
    plant_relation RECORD;
    distance REAL;
    weight REAL;
    score REAL := 0;
BEGIN
    score := 0.5
        + calculate_score_from_relations(p_layer_ids[1], p_plant_id, x_pos, y_pos)
        + calculate_score_from_shadings(p_layer_ids[2], p_plant_id, x_pos, y_pos);

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Calculate a score using the shadings.
CREATE FUNCTION calculate_score_from_shadings(
    p_layer_id integer, p_plant_id integer, x_pos integer, y_pos integer
)
RETURNS real AS $$
DECLARE
    point GEOMETRY;
    plant_shade shade;
    shading_shade shade;
    all_values shade[];
    pos1 INTEGER;
    pos2 INTEGER;
BEGIN
    -- Get the preferred shade of the plant
    SELECT shade INTO plant_shade
    FROM plants
    WHERE id = p_plant_id;

    -- Create a point from x_pos and y_pos
    point := ST_SetSRID(ST_MakePoint(x_pos, y_pos), 4326);
    -- Select the shading with the darkest shade that intersects the point
    SELECT shade INTO shading_shade
    FROM shadings
    WHERE layer_id = p_layer_id AND ST_Intersects(geometry, point)
    ORDER BY shade DESC
    LIMIT 1;

    -- If there's no shading, return 0
    IF NOT FOUND OR plant_shade IS NULL THEN
        RETURN 0;
    END IF;

    -- Get all possible enum values
    SELECT enum_range(NULL::shade) INTO all_values;

    -- Get the position of each enum value in the array
    SELECT array_position(all_values, plant_shade) INTO pos1;
    SELECT array_position(all_values, shading_shade) INTO pos2;

    -- Calculate the 'distance' to the preferred shade as a values between 0.5 and -0.5
    RETURN 0.5 - (abs(pos1 - pos2) / (ARRAY_LENGTH(all_values, 1) - 1)::REAL);
END;
$$ LANGUAGE plpgsql;
