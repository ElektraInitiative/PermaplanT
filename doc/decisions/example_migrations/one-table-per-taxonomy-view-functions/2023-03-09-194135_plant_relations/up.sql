CREATE SEQUENCE plants_id_seq
AS INTEGER
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

-- Create the "family" table
CREATE TABLE families (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    property1 TEXT,
    CONSTRAINT family_name_key UNIQUE (name)
);

-- Create the "genus" table
CREATE TABLE genera (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    property1 TEXT,
    family_id INTEGER REFERENCES families (id),
    CONSTRAINT genus_name_key UNIQUE (name)
);

-- Create the "species" table
CREATE TABLE species (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    property1 TEXT,
    genus_id INTEGER REFERENCES genera (id),
    CONSTRAINT species_name_key UNIQUE (name)
);

-- Create the "variety" table
CREATE TABLE varieties (
    id INTEGER DEFAULT nextval('plants_id_seq') PRIMARY KEY,
    name VARCHAR NOT NULL,
    unique_name TEXT NOT NULL,
    common_name_en TEXT [],
    common_name_de TEXT [],
    property1 TEXT,
    species_id INTEGER REFERENCES species (id),
    CONSTRAINT variety_name_key UNIQUE (unique_name),
    CONSTRAINT variety_name_key_rename UNIQUE (name)
);

-- Create the "cultivar" table
CREATE TABLE cultivars (
    id INTEGER DEFAULT nextval('plants_id_seq') PRIMARY KEY,
    unique_name TEXT NOT NULL,
    common_name_en TEXT [],
    common_name_de TEXT [],
    property1 TEXT,
    species_id INTEGER REFERENCES species (id),
    variety_id INTEGER REFERENCES varieties (id),
    CONSTRAINT unique_name_key UNIQUE (unique_name),
    CONSTRAINT check_variety_or_species CHECK (
        variety_id IS NULL OR species_id IS NULL
    )
);

-- Create a view joining the tables together
-- COALESCE function accepts an unlimited number of arguments.
-- It returns the first argument that is not null.

--todo
-- test cases vorbereiten wie select, insert, update
-- insert, update, delete schreiben.
CREATE OR REPLACE VIEW plants_view AS
SELECT
    p.id,
    p.unique_name,
    p.common_name_en,
    p.common_name_de,
    v.name AS variety_name,
    f.name AS family_name,
    g.name AS genus_name,
    s.name AS species_name,
    coalesce(
        p.property1,
        v.property1,
        s.property1,
        g.property1,
        f.property1
    ) AS property1
FROM (
    SELECT
        id,
        unique_name,
        common_name_en,
        common_name_de,
        property1,
        species_id,
        id AS variety_id
    FROM varieties
    UNION
    SELECT
        id,
        unique_name,
        common_name_en,
        common_name_de,
        property1,
        species_id,
        variety_id
    FROM cultivars
) AS p
LEFT JOIN varieties AS v ON p.variety_id = v.id
LEFT JOIN species AS s ON p.species_id = s.id
LEFT JOIN genera AS g ON s.genus_id = g.id
LEFT JOIN families AS f ON g.family_id = f.id;





CREATE OR REPLACE FUNCTION insert_plant_view_placeholder()
RETURNS TRIGGER AS $$
BEGIN
    -- Placeholder function, no implementation provided.
    -- will insert a new item and only fill columns, if they differ from parent tables.

    -- NEW contains ALL values i have selected in the view, so this should work perfectly :)
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
    DELETE FROM cultivar WHERE id = OLD.id;
    DELETE FROM variety WHERE id = OLD.id;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER delete_plant_view_trigger
INSTEAD OF DELETE ON plants_view
FOR EACH ROW
EXECUTE FUNCTION delete_plant_view_placeholder();
