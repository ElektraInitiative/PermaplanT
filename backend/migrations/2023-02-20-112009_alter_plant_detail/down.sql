-- This file should undo anything in `up.sql`
ALTER TABLE plant_detail DROP COLUMN license;
ALTER TABLE plant_detail DROP COLUMN article_last_modified_at;