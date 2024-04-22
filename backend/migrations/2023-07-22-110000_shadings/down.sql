-- This file should undo anything in `up.sql`
DROP FUNCTION calculate_score_from_shadings;

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

DROP TRIGGER check_shade_layer_type_before_insert_or_update ON shadings;
DROP FUNCTION check_shade_layer_type;
DROP TABLE shadings;
