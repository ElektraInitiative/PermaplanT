-- User table
CREATE TABLE users (
    ...
);

-- Project table
CREATE TABLE map (
    ...
);

-- Custom geometry type
CREATE DOMAIN geom_type AS GEOMETRY
CHECK (
    GeometryType(VALUE) IN ('POINT', 'LINESTRING', 'POLYGON') AND
    ST_SRID(VALUE) = 4326
);

/*
    Still up for discussion whether we want to also use cartesian coordinates

    CREATE DOMAIN geom_cartesian_type AS GEOMETRY
    CHECK (
        GeometryType(VALUE) IN ('POINT', 'LINESTRING', 'POLYGON') AND
        ST_SRID(VALUE) = 3857
    );
 */

-- Base Layer table
CREATE TABLE base_layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES map (id),
    geometry geom_type,
    base_type TEXT NOT NULL
);

-- Fertilize Layer table
CREATE TABLE fertilize_layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES map (id),
    geometry geom_type,
    fertilizer_type TEXT,
    application_rate NUMERIC
);

-- Dimensioning Layer table
CREATE TABLE dimensioning_layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES map (id),
    geometry geom_type,
    dimension_type TEXT,
    length NUMERIC,
    width NUMERIC
);

-- Hydrology Layer table
CREATE TABLE hydrology_layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES map (id),
    geometry geom_type,
    water_feature_type TEXT,
    depth NUMERIC
);

-- Infrastructure Layer table
CREATE TABLE infrastructure_layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES map (id),
    geometry geom_type,
    infrastructure_type TEXT
);

-- Label Layer table
CREATE TABLE label_layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES map (id),
    geometry geom_type,
    text_label TEXT,
    font_size INTEGER,
    font_color TEXT
);

-- Landscape Layer table
CREATE TABLE landscape_layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES map (id),
    geometry geom_type,
    landscape_element_type TEXT
);

-- Plants Layer table
CREATE TABLE plants_layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES map (id),
    geometry geom_type,
    plant_type TEXT,
    count INTEGER
);

-- Rest of the tables
-- ...

-- Indexes for faster spatial searches
CREATE INDEX base_layers_geom_idx ON base_layers USING gist (geometry);
CREATE INDEX fertilize_layers_geom_idx ON fertilize_layers USING gist (geometry);
CREATE INDEX dimensioning_layers_geom_idx ON dimensioning_layers USING gist (geometry);
CREATE INDEX hydrology_layers_geom_idx ON hydrology_layers USING gist (geometry);
CREATE INDEX infrastructure_layers_geom_idx ON infrastructure_layers USING gist (geometry);
CREATE INDEX label_layers_geom_idx ON label_layers USING gist (geometry);
CREATE INDEX landscape_layers_geom_idx ON landscape_layers USING gist (geometry);
CREATE INDEX plants_layers_geom_idx ON plants_layers USING gist (geometry);
-- ...

