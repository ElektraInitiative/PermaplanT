-- This file should undo anything in `up.sql`
ALTER TABLE plant_detail
ALTER COLUMN license TYPE VARCHAR(255);
DROP TYPE LICENSE;