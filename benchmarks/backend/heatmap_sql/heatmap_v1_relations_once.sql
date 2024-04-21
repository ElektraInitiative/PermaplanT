DROP TABLE IF EXISTS relations_summary CASCADE;
CREATE TABLE relations_summary (
    x integer,
    y integer,
    relation relation_type
);


-- Returns preference from 0-1 and relevance from 0-1 for each pixel of the map.
--
-- Positions where the plant should not be placed have preference close to 0.
-- Positions where the plant should be placed have preference close to 1.
--
-- Positions where there is no relevant data have relevance close to 0.
-- Positions where there is relevant data have relevance close to 1.
--
-- The resulting matrix does not contain valid (x,y) map coordinates,
-- instead (x,y) are simply the indices in the matrix.
-- The (x,y) coordinate of the computed heatmap always starts at
-- (0,0) no matter the boundaries of the map.
-- To get valid coordinates the user would therefore need to move and scale the
-- calculated heatmap by taking into account the boundaries of the map.
--
-- View the API documentation via Swagger for additional information.
--
-- p_map_id                ... map id
-- p_layer_ids             ... ids of the layers
-- p_plant_id              ... id of the plant for which to consider relations
-- date                    ... date at which to generate the heatmap
-- granularity             ... resolution of the map (must be greater than 0)
-- x_min,y_min,x_max,y_max ... boundaries of the map
CREATE OR REPLACE FUNCTION calculate_heatmap(
    p_map_id integer,
    p_layer_ids integer [],
    p_plant_id integer,
    date date,
    granularity integer,
    x_min integer,
    y_min integer,
    x_max integer,
    y_max integer
)
RETURNS TABLE (preference real, relevance real, x integer, y integer) AS $$
DECLARE
    score SCORE;
    map_geometry GEOMETRY(POLYGON, 4326);
    point GEOMETRY;
    bbox GEOMETRY;
    num_cols INTEGER;
    num_rows INTEGER;
    x_pos INTEGER;
    y_pos INTEGER;
    plant_relation RECORD;
    relations relations_summary[];
BEGIN
    -- Makes sure the layers exists and fits to the map
    FOR i IN 1..array_length(p_layer_ids, 1) LOOP
        IF NOT EXISTS (SELECT 1 FROM layers WHERE id = p_layer_ids[i] AND map_id = p_map_id) THEN
            RAISE EXCEPTION 'Layer with id % not found on map with id %', p_layer_ids[i], p_map_id;
        END IF;
    END LOOP;
    -- Makes sure the plant exists
    IF NOT EXISTS (SELECT 1 FROM plants WHERE id = p_plant_id) THEN
        RAISE EXCEPTION 'Plant with id % not found', p_plant_id;
    END IF;

    -- INTO STRICT makes sure the map exists. Does have to be explicitly checked as bounding box calculation would error anyways.
    SELECT geometry FROM maps WHERE id = p_map_id INTO STRICT map_geometry;

    relations := get_plant_relations_array(p_layer_ids[1], p_plant_id, date);

    -- Calculate the number of rows and columns based on the map's size and granularity
    num_cols := FLOOR((x_max - x_min) / granularity); -- Adjusted for granularity
    num_rows := FLOOR((y_max - y_min) / granularity); -- Adjusted for granularity

    -- Calculate the score for each point on the heatmap
    FOR i IN 0..num_cols-1 LOOP
        -- i and j do not represent coordinates. We need to adjust them to actual coordinates.
        x_pos := x_min + (i * granularity) + (granularity / 2);

        FOR j IN 0..num_rows-1 LOOP
            y_pos := y_min + (j * granularity) + (granularity / 2);

            -- Create a point from x_pos and y_pos
            point := ST_SetSRID(ST_MakePoint(x_pos, y_pos), 4326);

            -- If the point is on the map calculate a score; otherwise set score to 0.
            IF ST_Intersects(point, map_geometry) THEN
                score := calculate_score(p_map_id, p_layer_ids, p_plant_id, date, x_pos, y_pos, relations);
                score := scale_score(score);  -- scale to be between 0 and 1
                preference := score.preference;
                relevance := score.relevance;
            ELSE
                preference := 0.0;
                relevance := 0.0;
            END IF;

            x := i;
            y := j;

            RETURN NEXT;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Scales to values between 0 and 1.
--
-- Preference input space: Any value.
-- Relevance input space: >=0
CREATE OR REPLACE FUNCTION scale_score(input score)
RETURNS score AS $$
DECLARE
    score SCORE;
BEGIN
    score.preference := 1 / (1 + exp(-input.preference));       -- standard sigmoid, so that f(0)=0.5
    score.relevance := (2 / (1 + exp(-input.relevance))) - 1;   -- modified sigmoid, so that f(0)=0
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Calculate score for a certain position.
--
-- p_map_id       ... map id
-- p_layer_ids[1] ... plant layer (only the first array-element is used by the function)
-- p_plant_id     ... id of the plant for which to consider relations
-- date           ... date at which to generate the heatmap
-- x_pos,y_pos    ... coordinates on the map where to calculate the score
CREATE OR REPLACE FUNCTION calculate_score(
    p_map_id integer,
    p_layer_ids integer [],
    p_plant_id integer,
    date date,
    x_pos integer,
    y_pos integer,
    relations_p relations_summary []
)
RETURNS score AS $$
DECLARE
    plants SCORE;
BEGIN
    plants := calculate_score_from_relations(p_layer_ids[1], p_plant_id, date, x_pos, y_pos, relations_p);

    RETURN plants;
END;
$$ LANGUAGE plpgsql;



-- Calculate score using the plants relations and their distances.
CREATE OR REPLACE FUNCTION calculate_score_from_relations(
    p_layer_id integer,
    p_plant_id integer,
    date date,
    x_pos integer,
    y_pos integer,
    relations relations_summary []
-- NOT HERE
)
RETURNS score AS $$
DECLARE
    plant_relation RECORD;
    distance REAL;
    weight REAL;
    score SCORE;
    start_time timestamp;
    -- tble TABLE (x INTEGER, y INTEGER, relation RELATION_TYPE);
BEGIN
    IF NOT EXISTS (SELECT 1 FROM layers WHERE id = p_layer_id AND type = 'plants') THEN
        RAISE EXCEPTION 'Plant layer with id % not found', p_layer_id;
    END IF;

    score.preference := 0.0;
    score.relevance := 0.0;

    -- if relations is null, return 0
    IF relations IS NULL THEN
        RETURN score;
    END IF;

    FOREACH plant_relation IN ARRAY relations LOOP
        -- calculate euclidean distance
        distance := sqrt((plant_relation.x - x_pos)^2 + (plant_relation.y - y_pos)^2);

        -- calculate weight based on distance
        -- weight decreases between 1 and 0 based on distance
        -- distance is squared so it decreases faster the further away
        -- weight is halved at 50 cm away

        -- >>> w = lambda d: 1 / (1 + (d / 50) * (d / 50));
        -- >>> w(10)
        -- 0.9615384615384615
        -- >>> w(20)
        -- 0.8620689655172413
        -- >>> w(30)
        -- 0.7352941176470589
        -- >>> w(40)
        -- 0.6097560975609756
        -- >>> w(50)
        -- 0.5
        -- >>> w(100)
        -- 0.2
        -- >>> w(150)
        -- 0.1
        -- >>> w(200)
        -- 0.058823529411764705
        weight := 1 / (1 + (distance / 50)^2);

        -- update score based on relation
        IF plant_relation.relation = 'companion' THEN
            score.preference := score.preference + 0.5 * weight;
        ELSE
            score.preference := score.preference - 0.5 * weight;
        END IF;

        score.relevance := score.relevance + 0.5 * weight;
    END LOOP;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Get all relations for the plant on the specified layer.
CREATE OR REPLACE FUNCTION get_plant_relations_array(
    p_layer_id integer,
    p_plant_id integer,
    date date
)
RETURNS relations_summary [] AS $$
BEGIN
    RETURN ARRAY(
        -- We only need x,y and type of relation to calculate a score.
        SELECT ROW(plantings.x, plantings.y, relations.relation)
        FROM plantings
        JOIN plants ON plantings.plant_id = plants.id
        JOIN (
            -- We need UNION as the relation is bidirectional.
            SELECT plant1 AS plant, r1.relation
            FROM relations r1
            WHERE plant2 = p_plant_id
                AND r1.relation != 'neutral'
            UNION
            SELECT plant2 AS plant, r2.relation
            FROM relations r2
            WHERE plant1 = p_plant_id
                AND r2.relation != 'neutral'
        ) relations ON plants.id = relations.plant
        WHERE plantings.layer_id = p_layer_id
            AND (plantings.add_date IS NULL OR plantings.add_date <= date)
            AND (plantings.remove_date IS NULL OR plantings.remove_date > date)
        );
END;
$$ LANGUAGE plpgsql;

------------------------------------------------------------------------------------
-- SHADINGS -- SHADINGS -- SHADINGS -- SHADINGS -- SHADINGS -- SHADINGS -- SHADINGS
------------------------------------------------------------------------------------


-- Calculate score and relevance for a certain position.
--
-- p_map_id       ... map id
-- p_layer_ids[1] ... plant layer
-- p_layer_ids[2] ... shade layer
-- p_plant_id     ... id of the plant for which to consider relations
-- date           ... date at which to generate the heatmap
-- x_pos,y_pos    ... coordinates on the map where to calculate the score
CREATE OR REPLACE FUNCTION calculate_score(
    p_map_id integer,
    p_layer_ids integer [],
    p_plant_id integer,
    date date,
    x_pos integer,
    y_pos integer,
    relations_p relations_summary []
)
RETURNS score AS $$
DECLARE
    score SCORE;
    plants SCORE;
    shades SCORE;
BEGIN
    plants := calculate_score_from_relations(p_layer_ids[1], p_plant_id, date, x_pos, y_pos, relations_p);
    shades := calculate_score_from_shadings(p_layer_ids[2], p_plant_id, date, x_pos, y_pos);

    score.preference := plants.preference + shades.preference;
    score.relevance := plants.relevance + shades.relevance;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Calculate preference: Between -1 and 1 depending on shadings.
-- Calculate relevance: 1 if there is shading; otherwise 0.0.
--
-- If the plant would die at the position set preference=-100 and relevance=100.
CREATE OR REPLACE FUNCTION calculate_score_from_shadings(
    p_layer_id integer,
    p_plant_id integer,
    date date,
    x_pos integer,
    y_pos integer
)
RETURNS score AS $$
DECLARE
    point GEOMETRY;
    plant_shade SHADE;
    plant_light_requirement light_requirement [];
    allowed_shades SHADE [] := '{}';
    shading_shade SHADE;
    all_values SHADE[];
    pos1 INTEGER;
    pos2 INTEGER;
    score SCORE;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM layers WHERE id = p_layer_id AND type = 'shade') THEN
        RAISE EXCEPTION 'Shade layer with id % not found', p_layer_id;
    END IF;

    -- Get the required light level and preferred shade level of the plant
    SELECT light_requirement, shade INTO plant_light_requirement, plant_shade
    FROM plants
    WHERE id = p_plant_id;

    -- Create a point from x_pos and y_pos
    point := ST_SetSRID(ST_MakePoint(x_pos, y_pos), 4326);
    -- Select the shading with the darkest shade that intersects the point
    SELECT shade INTO shading_shade
    FROM shadings
    WHERE layer_id = p_layer_id
        AND (add_date IS NULL OR add_date <= date)
        AND (remove_date IS NULL OR remove_date > date)
        AND ST_Intersects(geometry, point)
    ORDER BY shade DESC
    LIMIT 1;

    -- If there's no shading, then there is sun.
    IF NOT FOUND THEN
        shading_shade := 'no shade';
    END IF;

    -- Check if the plant can survive at the position.
    -- If the plant can't survive set preference=-100 and relevance=100.
    IF plant_light_requirement IS NOT NULL
    THEN
        IF 'full sun' = ANY(plant_light_requirement)
        THEN
            allowed_shades := allowed_shades || '{"no shade", "light shade"}';
        END IF;
        IF 'partial sun/shade' = ANY(plant_light_requirement)
        THEN
            allowed_shades := allowed_shades || '{"light shade", "partial shade", "permanent shade"}';
        END IF;
        IF 'full shade' = ANY(plant_light_requirement)
        THEN
            allowed_shades := allowed_shades || '{"permanent shade", "permanent deep shade"}';
        END IF;

        IF NOT (shading_shade = ANY(allowed_shades))
        THEN
            score.preference := -100;
            score.relevance := 100;
            RETURN score;
        END IF;
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

    -- Calculate the 'distance' to the preferred shade as a values between -1 and 1
    score.preference := (0.5 - (abs(pos1 - pos2) / (ARRAY_LENGTH(all_values, 1) - 1)::REAL)^0.5) * 2.0;
    score.relevance := 1.0;

    RETURN score;
END;
$$ LANGUAGE plpgsql;
