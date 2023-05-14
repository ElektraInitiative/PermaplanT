-- Your SQL goes here
CREATE TABLE maps (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    creation_date DATE NOT NULL,
    deletion_date DATE,
    last_visit DATE,
    is_inactive BOOLEAN NOT NULL,
    zoom_factor SMALLINT NOT NULL,
    honors SMALLINT NOT NULL,
    visits SMALLINT NOT NULL,
    harvested SMALLINT NOT NULL
);
