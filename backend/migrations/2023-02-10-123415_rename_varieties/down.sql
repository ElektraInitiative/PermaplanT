-- This file should undo anything in `up.sql`
ALTER TABLE plants
  RENAME TO varieties;
ALTER TABLE varieties DROP COLUMN plant_type;