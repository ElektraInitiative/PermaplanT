-- Your SQL goes here
ALTER TABLE maps ADD COLUMN map_geom GEOMETRY(POLYGON, 4326) NOT NULL;

CREATE OR REPLACE FUNCTION calculate_score(map_id INTEGER, num_rows INTEGER, num_cols INTEGER)
RETURNS TABLE(score FLOAT, x INTEGER, y INTEGER) AS $$
DECLARE
    map_geometry GEOMETRY(POLYGON, 4326);
    cell GEOMETRY;
BEGIN
    SELECT map_geom FROM maps WHERE id = map_id INTO map_geometry;

    FOR i IN 0..num_rows-1 LOOP
        FOR j IN 0..num_cols-1 LOOP
            cell := ST_Translate(ST_GeomFromEWKT('SRID=4326;POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'), i, j);
            cell := ST_Intersection(cell, map_geometry);

            score := 0.5;
            x := i;
            y := j;

            RETURN NEXT;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
