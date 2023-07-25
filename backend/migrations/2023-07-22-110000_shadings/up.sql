-- Your SQL goes here
CREATE TABLE shadings (
    id UUID PRIMARY KEY,
    layer_id INTEGER NOT NULL,
    shade SHADE NOT NULL,
    geometry GEOMETRY (POLYGON, 4326) NOT NULL,
    add_date DATE,
    remove_date DATE,
    FOREIGN KEY (layer_id) REFERENCES layers (id) ON DELETE CASCADE
);

CREATE FUNCTION check_shade_layer_type() RETURNS TRIGGER
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

-- Calculate score and relevance for a certain position.
--
-- p_map_id       ... map id
-- p_layer_ids[1] ... plant layer
-- p_layer_ids[2] ... shade layer
-- p_plant_id     ... id of the plant for which to consider relations
-- x_pos,y_pos    ... coordinates on the map where to calculate the score
CREATE OR REPLACE FUNCTION calculate_score(
    p_map_id INTEGER,
    p_layer_ids INTEGER [],
    p_plant_id INTEGER,
    x_pos INTEGER,
    y_pos INTEGER
)
RETURNS SCORE AS $$
DECLARE
    score SCORE;
    plants SCORE;
    shades SCORE;
BEGIN
    plants := calculate_score_from_relations(p_layer_ids[1], p_plant_id, x_pos, y_pos);
    shades := calculate_score_from_shadings(p_layer_ids[2], p_plant_id, x_pos, y_pos);

    score.preference := 0.5 + plants.preference + shades.preference;
    score.relevance := plants.relevance + shades.relevance;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Calculate preference: Between -0.5 and 0.5 depending on shadings.
-- Calculate relevance: 0.5 if there is shading; otherwise 0.0.
-- If the plant is guaranteed to die set preference to -100 and relevance to 1.
CREATE FUNCTION calculate_score_from_shadings(
    p_layer_id INTEGER, p_plant_id INTEGER, x_pos INTEGER, y_pos INTEGER
)
RETURNS SCORE AS $$
DECLARE
    point GEOMETRY;
    plant_shade SHADE;
    plant_light_requirement light_requirement [];
    shading_shade SHADE;
    all_values SHADE[];
    pos1 INTEGER;
    pos2 INTEGER;
    score SCORE;
BEGIN
    -- Get the required light level and preferred shade level of the plant
    SELECT light_requirement, shade INTO plant_light_requirement, plant_shade
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

    -- If there's no shading, then there is sun.
    IF NOT FOUND THEN
        shading_shade := 'no shade';
    END IF;

    -- Check if the plant can survive at the position.
    -- If the plant can't survive set the score to -100 and relevance to 1.
    IF plant_light_requirement IS NOT NULL AND (
            (
                -- If the light_requirement contains 'full sun' the plant needs sun.
                'full sun' = ANY(plant_light_requirement) AND shading_shade NOT IN ('no shade', 'light shade')
            )
            OR
            (
                -- If the light_requirement contains 'partial sun/shade' the plant is ok with a bit of sun or shade.
                'partial sun/shade' = ANY(plant_light_requirement) AND shading_shade NOT IN ('light shade', 'partial shade', 'permanent shade')
            )
            OR
            (
                -- If the light_requirement contains 'full shade' sun the plant needs shade.
                'full shade' = ANY(plant_light_requirement) AND shading_shade NOT IN ('permanent shade', 'permanent deep shade')
            )
        )
    THEN
        score.preference := -100;
        score.relevance := 1;
        RETURN score;
    END IF;

    -- If there's no shading, return 0.
    IF plant_shade IS NULL THEN
        score.preference := 0.0;
        score.relevance := 0.0;
        RETURN score;
    END IF;

    -- Get all possible enum values
    SELECT enum_range(NULL::SHADE) INTO all_values;

    -- Get the position of each enum value in the array
    SELECT array_position(all_values, plant_shade) INTO pos1;
    SELECT array_position(all_values, shading_shade) INTO pos2;

    -- Calculate the 'distance' to the preferred shade as a values between -0.5 and 0.5
    score.preference := 0.5 - (abs(pos1 - pos2) / (ARRAY_LENGTH(all_values, 1) - 1)::REAL);
    score.relevance := 0.5;

    RETURN score;
END;
$$ LANGUAGE plpgsql;
