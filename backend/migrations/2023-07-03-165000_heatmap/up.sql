-- Your SQL goes here
ALTER TABLE maps ADD COLUMN geometry GEOMETRY (POLYGON, 4326) NOT NULL;


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


-- Returns scores from 0-1 for each pixel of the map.
-- Values where the plant should not be placed are close to 0.
-- Values where the plant should be placed are close to 1.
--
-- The resulting matrix does not contain valid (x,y) coordinates,
-- instead (x,y) are simply the indices in the matrix.
-- The (x,y) coordinate of the computed heatmap always starts at
-- (0,0) no matter the boundaries of the map.
-- To get valid coordinates the user would therefore need to move and scale the
-- calculated heatmap by taking into account the boundaries of the map.
--
-- p_map_id                ... map id
-- p_layer_id              ... id of the plant layer
-- p_plant_id              ... id of the plant for which to consider relations
-- granularity             ... resolution of the map (float greater than 0)
-- x_min,y_min,x_max,y_max ... boundaries of the map
CREATE OR REPLACE FUNCTION calculate_heatmap(
    p_map_id INTEGER,
    p_layer_id INTEGER,
    p_plant_id INTEGER,
    granularity INTEGER,
    x_min INTEGER,
    y_min INTEGER,
    x_max INTEGER,
    y_max INTEGER
)
RETURNS TABLE (score REAL, x INTEGER, y INTEGER) AS $$
DECLARE
    map_geometry GEOMETRY(POLYGON, 4326);
    cell GEOMETRY;
    bbox GEOMETRY;
    num_cols INTEGER;
    num_rows INTEGER;
    x_pos INTEGER;
    y_pos INTEGER;
    plant_relation RECORD;
BEGIN
    -- Makes sure the plant layer exists and fits to the map
    IF NOT EXISTS (SELECT 1 FROM layers WHERE id = p_layer_id AND type = 'plants' AND map_id = p_map_id) THEN
        RAISE EXCEPTION 'Layer with id % not found', p_layer_id;
    END IF;
    -- Makes sure the plant exists
    IF NOT EXISTS (SELECT 1 FROM plants WHERE id = p_plant_id) THEN
        RAISE EXCEPTION 'Plant with id % not found', p_plant_id;
    END IF;

    -- INTO STRICT makes sure the map exists. Does have to be explicitly checked as bounding box calculation would error anyways.
    SELECT geometry FROM maps WHERE id = p_map_id INTO STRICT map_geometry;

    -- Calculate the number of rows and columns based on the map's size and granularity
    num_cols := CEIL((x_max - x_min) / granularity); -- Adjusted for granularity
    num_rows := CEIL((y_max - y_min) / granularity); -- Adjusted for granularity

    -- Calculate the score for each pixel on the heatmap
    FOR i IN 0..num_cols-1 LOOP
        FOR j IN 0..num_rows-1 LOOP
            -- i and j do not represent coordinates. We need to adjust them to actual coordinates.
            x_pos := x_min + (i * granularity);
            y_pos := y_min + (j * granularity);

            -- Make a square the same size as the granularity
            cell := ST_Translate(ST_GeomFromEWKT('SRID=4326;POLYGON((0 0, ' || granularity || ' 0, ' || granularity || ' ' || granularity || ', 0 ' || granularity || ', 0 0))'), x_pos, y_pos);

            -- If the square is on the map calculate a score; otherwise set score to 0.
            IF ST_Intersects(cell, map_geometry) THEN
                score := calculate_score(p_map_id, p_layer_id, p_plant_id, x_pos, y_pos);
                score := scale_score(score);  -- scale the score to be between 0 and 1
            ELSE
                score := 0.0;
            END IF;

            x := i;
            y := j;

            RETURN NEXT;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Scales the score to values 0-1.
CREATE OR REPLACE FUNCTION scale_score(input REAL)
RETURNS REAL AS $$
BEGIN
    RETURN LEAST(GREATEST(input, 0), 1);
END;
$$ LANGUAGE plpgsql;

-- Calculate a score for a certain position.
CREATE OR REPLACE FUNCTION calculate_score(
    p_map_id INTEGER,
    p_layer_id INTEGER,
    p_plant_id INTEGER,
    x_pos INTEGER,
    y_pos INTEGER
)
RETURNS FLOAT AS $$
DECLARE
    plant_relation RECORD;
    distance REAL;
    weight REAL;
    score REAL := 0;
BEGIN
    score := 0.5 + calculate_score_from_relations(p_layer_id, p_plant_id, x_pos, y_pos);

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Calculate a score using the plants relations and their distances.
CREATE OR REPLACE FUNCTION calculate_score_from_relations(
    p_layer_id INTEGER, p_plant_id INTEGER, x_pos INTEGER, y_pos INTEGER
)
RETURNS FLOAT AS $$
DECLARE
    plant_relation RECORD;
    distance REAL;
    weight REAL;
    score REAL := 0;
BEGIN
    FOR plant_relation IN (SELECT * FROM get_plant_relations(p_layer_id, p_plant_id)) LOOP
        -- calculate distance
        distance := sqrt((plant_relation.x - x_pos)^2 + (plant_relation.y - y_pos)^2);

        -- calculate weight based on distance
        weight := 1 / (distance + 1);

        -- update score based on relation
        IF plant_relation.relation = 'companion' THEN
            score := score + 0.5 * weight;
        ELSE
            score := score - 0.5 * weight;
        END IF;
    END LOOP;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Get all relations for the plant on the specified layer.
CREATE OR REPLACE FUNCTION get_plant_relations(
    p_layer_id INTEGER, p_plant_id INTEGER
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
        WHERE plantings.layer_id = p_layer_id;
END;
$$ LANGUAGE plpgsql;
