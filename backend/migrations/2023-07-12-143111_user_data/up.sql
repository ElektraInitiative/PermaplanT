-- This migration already ran on www.permaplant.net
-- So it cannot be edited, except of comments or formatting.
-- Please create a new migration instead.

CREATE TYPE salutation AS ENUM (
    'ms',
    'mrs',
    'mr',
    'mx'
);

CREATE TYPE experience AS ENUM (
    'beginner',
    'advanced',
    'expert'
);

CREATE TYPE membership AS ENUM (
    'supporting',
    'regular',
    'contributing'
);

CREATE TABLE users (
    id uuid PRIMARY KEY,
    salutation salutation NOT NULL,
    title text,
    country text NOT NULL,
    phone text,
    website text,
    organization text,
    experience experience,
    membership membership,
    member_years integer ARRAY,
    member_since date,
    permacoins integer ARRAY
);
