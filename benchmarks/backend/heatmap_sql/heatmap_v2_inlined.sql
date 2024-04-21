DROP TABLE IF EXISTS relations_summary CASCADE;
CREATE TABLE relations_summary (
    x integer,
    y integer,
    relation relation_type
);


DROP FUNCTION IF EXISTS calculate_heatmap;
DROP FUNCTION IF EXISTS scale_score;
DROP FUNCTION IF EXISTS calculate_score;
DROP FUNCTION IF EXISTS calculate_score_from_relations;
DROP FUNCTION IF EXISTS calculate_score_from_shadings;


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
    map_geometry GEOMETRY(POLYGON, 4326);
    point GEOMETRY;
    bbox GEOMETRY;
    num_cols INTEGER;
    num_rows INTEGER;
    x_pos INTEGER;
    y_pos INTEGER;
    plant_relation RECORD;
    plant_score SCORE;
    shading_score SCORE;
    combined_score SCORE;
    output_score SCORE;
    distance REAL;
    weight REAL;
    plant_shade SHADE;
    plant_light_requirement light_requirement [];
    allowed_shades SHADE [] := '{}';
    shading_shade SHADE;
    all_values SHADE[];
    pos1 INTEGER;
    pos2 INTEGER;
    shading_score_found BOOLEAN;
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
    IF NOT EXISTS (SELECT 1 FROM layers WHERE id = p_layer_ids[2] AND type = 'shade') THEN
        RAISE EXCEPTION 'Shade layer with id % not found', p_layer_ids[2];
    END IF;

    -- INTO STRICT makes sure the map exists. Does have to be explicitly checked as bounding box calculation would error anyways.
    SELECT geometry FROM maps WHERE id = p_map_id INTO STRICT map_geometry;

    -- Calculate the number of rows and columns based on the map's size and granularity
    num_cols := FLOOR((x_max - x_min) / granularity); -- Adjusted for granularity
    num_rows := FLOOR((y_max - y_min) / granularity); -- Adjusted for granularity

    relations := get_plant_relations_array(p_layer_ids[1], p_plant_id, date);

    -- Get all possible enum values
    SELECT enum_range(NULL::SHADE) INTO all_values;

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
                ----------------------------------------------------------------------------------
                -- PLANT SCORE
                plant_score.preference := 0.0;
                plant_score.relevance := 0.0;

                FOREACH plant_relation IN ARRAY relations LOOP
                    -- calculate euclidean distance
                    distance := sqrt((plant_relation.x - x_pos)^2 + (plant_relation.y - y_pos)^2);

                    -- calculate weight based on distance
                    -- weight decreases between 1 and 0 based on distance
                    -- distance is squared so it decreases faster the further away
                    -- weight is halved at 50 cm away
                    weight := 1 / (1 + (distance / 50)^2);

                    -- update score based on relation
                    IF plant_relation.relation = 'companion' THEN
                        plant_score.preference := plant_score.preference + 0.5 * weight;
                    ELSE
                        plant_score.preference := plant_score.preference - 0.5 * weight;
                    END IF;

                    plant_score.relevance := plant_score.relevance + 0.5 * weight;
                END LOOP;


                ----------------------------------------------------------------------------------
                -- SHADING SCORE
                shading_score.preference := 0.0;
                shading_score.relevance := 0.0;
                shading_score_found := false;

                -- Get the required light level and preferred shade level of the plant
                SELECT light_requirement, shade INTO plant_light_requirement, plant_shade
                FROM plants
                WHERE id = p_plant_id;

                -- Create a point from x_pos and y_pos
                point := ST_SetSRID(ST_MakePoint(x_pos, y_pos), 4326);
                -- Select the shading with the darkest shade that intersects the point
                SELECT shade INTO shading_shade
                FROM shadings
                WHERE layer_id = p_layer_ids[2]
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
                        shading_score.preference := -100;
                        shading_score.relevance := 100;
                        shading_score_found := true;
                    END IF;
                END IF;

                -- If there's no shading, return 0.
                IF plant_shade IS NULL AND NOT shading_score_found THEN
                    shading_score.preference := 0.0;
                    shading_score.relevance := 0.0;
                    shading_score_found := true;
                END IF;

                IF NOT shading_score_found THEN

                    -- Get the position of each enum value in the array
                    SELECT array_position(all_values, plant_shade) INTO pos1;
                    SELECT array_position(all_values, shading_shade) INTO pos2;

                    -- Calculate the 'distance' to the preferred shade as a values between -1 and 1
                    shading_score.preference := (0.5 - (abs(pos1 - pos2) / (ARRAY_LENGTH(all_values, 1) - 1)::REAL)^0.5) * 2.0;
                    shading_score.relevance := 1.0;
                END IF;

                -----------------------------------------------------------------------------------------
                -- COMBINED SCORE
                combined_score.preference := plant_score.preference + shading_score.preference;
                combined_score.relevance := plant_score.relevance + shading_score.relevance;

                -- scale to be between 0 and 1
                output_score.preference := 1 / (1 + exp(-combined_score.preference));       -- standard sigmoid, so that f(0)=0.5
                output_score.relevance := (2 / (1 + exp(-combined_score.relevance))) - 1;   -- modified sigmoid, so that f(0)=0

                preference := output_score.preference;
                relevance := output_score.relevance;
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
