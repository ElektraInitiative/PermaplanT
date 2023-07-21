-- Your SQL goes here
CREATE TABLE guided_tours (
    user_id UUID PRIMARY KEY,
    editor_tour BOOLEAN NOT NULL DEFAULT false
);

CREATE TYPE track AS ENUM (
    'Beginners Track',
    'Seasonal Track',
    'Completionist Track',
    'Expert Track'
);

CREATE TABLE blossoms (
    title TEXT PRIMARY KEY,
    description TEXT,
    track TRACK,
    icon TEXT,
    is_seasonal BOOLEAN NOT NULL
);

CREATE TABLE blossoms_gained (
    user_id UUID NOT NULL,
    blossom TEXT NOT NULL REFERENCES blossoms(title),
    times_gained INTEGER NOT NULL,
    gained_date DATE NOT NULL,
    PRIMARY KEY (user_id, blossom)
);
