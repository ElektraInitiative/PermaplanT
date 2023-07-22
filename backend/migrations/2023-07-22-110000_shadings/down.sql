-- This file should undo anything in `up.sql`
DROP TRIGGER check_shade_layer_type_before_insert_or_update ON plantings;
DROP FUNCTION check_shade_layer_type;
DROP TABLE shadings;
