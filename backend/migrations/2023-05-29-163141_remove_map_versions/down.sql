-- This file should undo anything in `up.sql`
CREATE TABLE map_versions (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES maps(id) NOT NULL,
    version_name TEXT NOT NULL,
    snapshot_date DATE NOT NULL
)
