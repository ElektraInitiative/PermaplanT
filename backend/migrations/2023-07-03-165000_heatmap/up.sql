-- Your SQL goes here
ALTER TABLE maps ADD COLUMN map_geom GEOMETRY(POLYGON, 4326) NOT NULL;

CREATE OR REPLACE FUNCTION calculate_score(map_id INTEGER, plant_id INTEGER, num_rows INTEGER, num_cols INTEGER)
RETURNS TABLE(score FLOAT, x INTEGER, y INTEGER) AS $$
DECLARE
    map_geometry GEOMETRY(POLYGON, 4326);
    cell GEOMETRY;
BEGIN
    SELECT map_geom FROM maps WHERE id = map_id INTO map_geometry;

    -- TODO: include plant in calculation (e.g. for shade)
    FOR i IN 0..num_rows-1 LOOP
        FOR j IN 0..num_cols-1 LOOP
            cell := ST_Translate(ST_GeomFromEWKT('SRID=4326;POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'), i, j);

            IF ST_Intersects(cell, map_geometry) THEN
                -- TODO: calculate score
                score := 0.5;
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
