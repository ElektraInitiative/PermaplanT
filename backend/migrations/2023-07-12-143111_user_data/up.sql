-- Your SQL goes here
CREATE TYPE salutation AS ENUM (
    'Ms',
    'Mrs',
    'Mr'
);

CREATE TYPE experience AS ENUM (
    'beginner',
    'advanced',
    'expert'
);

CREATE TYPE membership AS ENUM (
    'Supporting Member',
    'Regular Member',
    'Contributing Member'
);

CREATE TABLE user_data (
    id UUID PRIMARY KEY,
    salutation SALUTATION NOT NULL,
    title TEXT,
    country TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    organization TEXT,
    experience EXPERIENCE,
    membership MEMBERSHIP,
    member_years INTEGER ARRAY,
    member_since DATE,
    permacoins INTEGER ARRAY
);
