-- Create the "family" table
CREATE TABLE family (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    property1 TEXT,
    CONSTRAINT family_name_key UNIQUE (name)
);

-- Create the "genus" table
CREATE TABLE genus (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    property1 TEXT,
    family_id INTEGER NOT NULL REFERENCES family (id),
    CONSTRAINT genus_name_key UNIQUE (name)
);

-- Create the "species" table
CREATE TABLE species (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    property1 TEXT,
    genus_id INTEGER NOT NULL REFERENCES genus (id),
    CONSTRAINT species_name_key UNIQUE (name)
);

-- Create the "variety" table
CREATE TABLE variety (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    property1 TEXT,
    species_id INTEGER NOT NULL REFERENCES species (id),
    CONSTRAINT variety_name_key UNIQUE (name)
);

-- Create the "cultivar" table
CREATE TABLE cultivar (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    property1 TEXT,
    species_id INTEGER NOT NULL REFERENCES species (id),
    variety_id INTEGER NOT NULL REFERENCES variety (id),
    CONSTRAINT cultivar_name_key UNIQUE (name)
);

-- Create the "plantsDetails" table
CREATE TABLE plantsdetails (
    id INTEGER NOT NULL,
    unique_name TEXT NOT NULL,
    common_name_en TEXT [],
    common_name_de TEXT [],
    property1 TEXT,
    family_id INTEGER NOT NULL REFERENCES family (id),
    genus_id INTEGER NOT NULL REFERENCES genus (id),
    species_id INTEGER NOT NULL,
    variety_id INTEGER,
    cultivar_id INTEGER,
    CONSTRAINT unique_name_key UNIQUE (unique_name),
    CONSTRAINT check_variety_or_cultivar CHECK (
        variety_id IS NULL OR cultivar_id IS NULL
    )
);

-- Create a view joining the tables together
-- COALESCE function accepts an unlimited number of arguments.
-- It returns the first argument that is not null.
CREATE OR REPLACE VIEW plants AS
SELECT
    p.id AS plant_id,
    p.unique_name,
    p.common_name_en,
    p.common_name_de,
    f.name AS family_name,
    g.name AS genus_name,
    s.name AS species_name,
    v.name AS variety_name,
    c.name AS cultivar_name,
    coalesce(
        p.property1,
        c.property1,
        v.property1,
        s.property1,
        g.property1,
        f.property1
    ) AS property1
FROM plants AS p
INNER JOIN family AS f ON p.family_id = f.id
INNER JOIN genus AS g ON p.genus_id = g.id
INNER JOIN species AS s ON p.species_id = s.id
LEFT JOIN variety AS v ON p.variety_id = v.id
LEFT JOIN cultivar AS c ON p.cultivar_id = c.id;


CREATE OR REPLACE FUNCTION insert_plant_view_placeholder()
RETURNS TRIGGER AS $$
BEGIN
    -- Placeholder function, no implementation provided.
    -- will insert a new item and only fill columns, if they differ from parent tables.
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER insert_plant_view_trigger
INSTEAD OF INSERT ON plants_view
FOR EACH ROW
EXECUTE FUNCTION insert_plant_view_placeholder();



CREATE OR REPLACE FUNCTION update_plant_view_placeholder()
RETURNS TRIGGER AS $$
BEGIN
    -- Placeholder function, no implementation provided.
    -- will only update values in plantDetails if they differ from a parent table.
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_plant_view_trigger
INSTEAD OF UPDATE ON plants_view
FOR EACH ROW
EXECUTE FUNCTION update_plant_view_placeholder();


CREATE OR REPLACE FUNCTION delete_plant_view_placeholder()
RETURNS TRIGGER AS $$
BEGIN
    -- Placeholder function, no implementation provided.
    -- Will simply delete from the plantsDetails table
    RETURN OLD;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER delete_plant_view_trigger
INSTEAD OF DELETE ON plants_view
FOR EACH ROW
EXECUTE FUNCTION delete_plant_view_placeholder();
