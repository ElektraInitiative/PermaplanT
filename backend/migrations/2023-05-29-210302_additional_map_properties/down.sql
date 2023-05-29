-- This file should undo anything in `up.sql`
ALTER TABLE maps DROP COLUMN is_private;
ALTER TABLE maps DROP COLUMN description;
