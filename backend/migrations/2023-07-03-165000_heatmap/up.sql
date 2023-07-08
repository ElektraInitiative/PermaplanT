-- Your SQL goes here
ALTER TABLE maps ADD COLUMN geometry GEOMETRY(POLYGON, 4326) NOT NULL;

-- Scales the input to values 0-1.
CREATE OR REPLACE FUNCTION scale_input(input REAL)
RETURNS REAL AS $$
BEGIN
    IF input > 1 THEN
        RETURN 1;
    ELSIF input < 0 THEN
        RETURN 0;
    ELSE
        RETURN input;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Calculate the bounding box of the map geometry.
CREATE OR REPLACE FUNCTION calculate_bbox(map_id INTEGER)
RETURNS TABLE(x_min REAL, y_min REAL, x_max REAL, y_max REAL) AS $$
DECLARE
    map_geometry GEOMETRY(POLYGON, 4326);
    bbox GEOMETRY;
BEGIN
    SELECT geometry FROM maps WHERE id = map_id INTO STRICT map_geometry;

    -- Get the bounding box of the map's geometry
    bbox := ST_Envelope(map_geometry);

    -- Return bounding box information
    x_min := ST_XMin(bbox);
    y_min := ST_YMin(bbox);
    x_max := ST_XMax(bbox);
    y_max := ST_YMax(bbox);

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Returns scores from 0-1 for each pixel of the map. It should never return values greater than 1.
-- Values where the plant should not be placed are close to 0.
-- Values where the plant should be placed are close to 1.
-- The score at position x=0,y=0 is at the position x=x_min,y=y_min.
CREATE OR REPLACE FUNCTION calculate_score(map_id INTEGER, plant_id INTEGER, granularity REAL, x_min REAL, y_min REAL, x_max REAL, y_max REAL)
RETURNS TABLE(score REAL, x INTEGER, y INTEGER) AS $$
DECLARE
    map_geometry GEOMETRY(POLYGON, 4326);
    cell GEOMETRY;
    bbox GEOMETRY;
    num_cols INTEGER;
    num_rows INTEGER;
    x_pos REAL;
    y_pos REAL;
BEGIN
    SELECT geometry FROM maps WHERE id = map_id INTO STRICT map_geometry;

    -- Calculate the number of rows and columns based on the map's size and granularity
    num_cols := CEIL((x_max - x_min) / granularity); -- Adjusted for granularity
    num_rows := CEIL((y_max - y_min) / granularity); -- Adjusted for granularity

    -- TODO: include plant in calculation (e.g. for shade)
    FOR i IN 0..num_cols-1 LOOP
        FOR j IN 0..num_rows-1 LOOP
            -- i and j do not represent coordinates. We still need to adjust them to actual coordinates.
            x_pos := x_min + (i * granularity);
            y_pos := y_min + (j * granularity);

            cell := ST_Translate(ST_GeomFromEWKT('SRID=4326;POLYGON((0 0, ' || granularity || ' 0, ' || granularity || ' ' || granularity || ', 0 ' || granularity || ', 0 0))'), x_pos, y_pos);

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
