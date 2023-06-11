-- This file should undo anything in `up.sql`
ALTER TABLE maps DROP COLUMN privacy;
ALTER TABLE maps DROP COLUMN description;
ALTER TABLE maps DROP COLUMN location;
DROP EXTENSION postgis;
DROP TYPE PRIVACY_OPTIONS;
