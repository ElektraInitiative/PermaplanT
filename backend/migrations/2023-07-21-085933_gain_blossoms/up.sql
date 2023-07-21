-- Your SQL goes here
CREATE TABLE guided_tours (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    editor_tour BOOLEAN NOT NULL DEFAULT false
);

CREATE TYPE track AS ENUM (
    'Beginners Track',
    'Seasonal Track',
    'Completionist Track',
    'Expert Track'
);

CREATE TABLE blossoms (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    track TRACK,
    icon TEXT,
    is_seasonal BOOLEAN NOT NULL
);

CREATE TABLE blossoms_gained (
    user_id UUID NOT NULL,
    blossom_id INTEGER NOT NULL REFERENCES blossoms(id),
    times_gained INTEGER,
    gained_date DATE,
    PRIMARY KEY (user_id, blossom_id)
);
