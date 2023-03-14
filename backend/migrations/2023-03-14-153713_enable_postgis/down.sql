-- This file should undo anything in `up.sql`
DROP EXTENSION IF EXISTS postgis CASCADE;
DROP TABLE IF EXISTS geometry_samples;