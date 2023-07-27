-- Your SQL goes here
CREATE TYPE track AS ENUM (
    'beginner',
    'seasonal',
    'completionist',
    'expert'
);

CREATE TABLE guided_tours (
    user_id UUID PRIMARY KEY,
    editor_tour_completed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE blossoms (
    title TEXT PRIMARY KEY,
    description TEXT,
    track TRACK,
    icon TEXT,
    is_seasonal BOOLEAN NOT NULL
);

CREATE TABLE gained_blossoms (
    user_id UUID NOT NULL,
    blossom TEXT NOT NULL,
    times_gained INTEGER NOT NULL,
    gained_date DATE NOT NULL,
    PRIMARY KEY (user_id, blossom)
);
