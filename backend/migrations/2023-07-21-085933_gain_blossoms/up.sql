-- This migration already ran on www.permaplant.net
-- So it cannot be edited, except of comments or formatting.
-- Please create a new migration instead.

CREATE TYPE track AS ENUM (
    'beginner',
    'seasonal',
    'completionist',
    'expert'
);

CREATE TABLE guided_tours (
    user_id uuid PRIMARY KEY,
    editor_tour_completed boolean NOT NULL DEFAULT false
);

CREATE TABLE blossoms (
    title text PRIMARY KEY,
    description text,
    track track,
    icon text,
    is_seasonal boolean NOT NULL
);

CREATE TABLE gained_blossoms (
    user_id uuid NOT NULL,
    blossom text NOT NULL,
    times_gained integer NOT NULL,
    gained_date date NOT NULL,
    PRIMARY KEY (user_id, blossom)
);
