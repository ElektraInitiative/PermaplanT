-- This file should undo anything in `up.sql`
ALTER TABLE maps
DROP COLUMN owner_id;
ALTER TABLE maps
ADD COLUMN owner_id INTEGER NOT NULL;
