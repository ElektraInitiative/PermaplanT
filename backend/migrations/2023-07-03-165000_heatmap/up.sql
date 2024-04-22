-- Your SQL goes here

-- Calculate the bounding box of the map geometry.
CREATE OR REPLACE FUNCTION calculate_bbox(map_id INTEGER)
RETURNS TABLE (x_min INTEGER, y_min INTEGER, x_max INTEGER, y_max INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CAST(floor(ST_XMin(bbox)) AS INTEGER) AS x_min,
        CAST(floor(ST_YMin(bbox)) AS INTEGER) AS y_min,
        CAST(ceil(ST_XMax(bbox)) AS INTEGER) AS x_max,
        CAST(ceil(ST_YMax(bbox)) AS INTEGER) AS y_max
    FROM (
        SELECT
            ST_Envelope(geometry) AS bbox
        FROM maps
        WHERE id = map_id
    ) AS subquery;
END;
$$ LANGUAGE plpgsql;

-- The score is defined as the preference and the relevance.
CREATE TYPE score AS (
    preference REAL,
    relevance REAL
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
    p_map_id INTEGER,
    p_layer_ids INTEGER [],
    p_plant_id INTEGER,
    date DATE,
    granularity INTEGER,
    x_min INTEGER,
    y_min INTEGER,
    x_max INTEGER,
    y_max INTEGER
)
RETURNS TABLE (preference REAL, relevance REAL, x INTEGER, y INTEGER) AS $$
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
                score := calculate_score(p_map_id, p_layer_ids, p_plant_id, date, x_pos, y_pos);
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
CREATE OR REPLACE FUNCTION scale_score(input SCORE)
RETURNS SCORE AS $$
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
    p_map_id INTEGER,
    p_layer_ids INTEGER [],
    p_plant_id INTEGER,
    date DATE,
    x_pos INTEGER,
    y_pos INTEGER
)
RETURNS SCORE AS $$
DECLARE
    plants SCORE;
BEGIN
    plants := calculate_score_from_relations(p_layer_ids[1], p_plant_id, date, x_pos, y_pos);

    RETURN plants;
END;
$$ LANGUAGE plpgsql;

-- Calculate score using the plants relations and their distances.
CREATE OR REPLACE FUNCTION calculate_score_from_relations(
    p_layer_id INTEGER,
    p_plant_id INTEGER,
    date DATE,
    x_pos INTEGER,
    y_pos INTEGER
)
RETURNS SCORE AS $$
DECLARE
    plant_relation RECORD;
    distance REAL;
    weight REAL;
    score SCORE;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM layers WHERE id = p_layer_id AND type = 'plants') THEN
        RAISE EXCEPTION 'Plant layer with id % not found', p_layer_id;
    END IF;

    score.preference := 0.0;
    score.relevance := 0.0;

    FOR plant_relation IN (SELECT * FROM get_plant_relations(p_layer_id, p_plant_id, date)) LOOP
        -- calculate euclidean distance
        distance := sqrt((plant_relation.x - x_pos)^2 + (plant_relation.y - y_pos)^2);

        -- calculate weight based on distance
        -- weight decreases between 1 and 0 based on distance
        -- distance is squared so it decreases faster the further away
        -- weight is halved at 50 cm away
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
CREATE OR REPLACE FUNCTION get_plant_relations(
    p_layer_id INTEGER,
    p_plant_id INTEGER,
    date DATE
)
RETURNS TABLE (x INTEGER, y INTEGER, relation RELATION_TYPE) AS $$
BEGIN
    RETURN QUERY
        -- We only need x,y and type of relation to calculate a score.
        SELECT plantings.x, plantings.y, relations.relation
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
            AND (plantings.remove_date IS NULL OR plantings.remove_date > date);
END;
$$ LANGUAGE plpgsql;
