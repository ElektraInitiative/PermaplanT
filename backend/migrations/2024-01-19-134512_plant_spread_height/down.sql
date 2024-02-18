-- Change plant spread and height to enum types

CREATE TYPE plant_height AS ENUM (
    'low',
    'medium',
    'high'
);

CREATE TYPE plant_spread AS ENUM (
    'narrow',
    'medium',
    'wide'
);

ALTER TABLE plants ALTER COLUMN height TYPE plant_height USING null;
ALTER TABLE plants ALTER COLUMN spread TYPE plant_spread USING null;
