-- This file should undo anything in `up.sql`
DROP FUNCTION calculate_score_from_shadings;

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
BEGIN
    plants := calculate_score_from_relations(p_layer_ids[1], p_plant_id, x_pos, y_pos);

    score.preference := 0.5 + plants.preference;
    score.relevance := 0.2 + plants.relevance;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER check_shade_layer_type_before_insert_or_update ON shadings;
DROP FUNCTION check_shade_layer_type;
DROP TABLE shadings;
