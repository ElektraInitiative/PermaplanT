-- This file should undo anything in `up.sql`
DROP FUNCTION calculate_score;
ALTER TABLE maps DROP COLUMN map_geom;
