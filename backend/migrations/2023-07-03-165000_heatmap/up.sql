-- Your SQL goes here
ALTER TABLE maps ADD COLUMN geometry GEOMETRY(POLYGON, 4326) NOT NULL;

-- Scales the input to values 0-1.
CREATE OR REPLACE FUNCTION scale_input(input REAL)
RETURNS REAL AS $$
BEGIN
    IF input > 1 THEN
        RETURN 1;
    ELSE
        RETURN input;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Returns scores from 0-1 for each pixel of the map. It should never return values greater than 1.
-- Values where the plant should not be placed are close to 0.
-- Values where the plant should be placed are close to 1.
CREATE OR REPLACE FUNCTION calculate_score(map_id INTEGER, plant_id INTEGER, num_rows INTEGER, num_cols INTEGER)
RETURNS TABLE(score REAL, x INTEGER, y INTEGER) AS $$
DECLARE
    map_geometry GEOMETRY(POLYGON, 4326);
    cell GEOMETRY;
BEGIN
    SELECT geometry FROM maps WHERE id = map_id INTO STRICT map_geometry;

    -- TODO: include plant in calculation (e.g. for shade)
    FOR i IN 0..num_rows-1 LOOP
        FOR j IN 0..num_cols-1 LOOP
            cell := ST_Translate(ST_GeomFromEWKT('SRID=4326;POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'), i, j);

            IF ST_Intersects(cell, map_geometry) THEN
                -- TODO: calculate score using e.g shade
                score := 0.5;
                score := scale_input(score);  -- scale the score to be between 0 and 1
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
