-- Your SQL goes here
CREATE TYPE QUALITY AS ENUM (
    'Organic',
    'Not organic',
    'Unknown'
);
CREATE TYPE QUANTITY AS ENUM (
    'Nothing',
    'Not enough',
    'Enough',
    'More than enough'
);
CREATE TABLE seeds (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    harvest_year SMALLINT NOT NULL,
    use_by DATE,
    origin TEXT,
    taste TEXT,
    yield TEXT,
    quantity QUANTITY NOT NULL,
    quality QUALITY,
    price SMALLINT,
    generation SMALLINT,
    notes TEXT,
    variety TEXT,
    plant_id INTEGER REFERENCES plants(id)
);
