-- This file should undo anything in `up.sql`
DROP FUNCTION get_plant_relations;
DROP FUNCTION calculate_score_from_relations;
DROP FUNCTION scale_score;
DROP FUNCTION calculate_score;
DROP FUNCTION calculate_bbox;
ALTER TABLE maps DROP COLUMN geometry;
