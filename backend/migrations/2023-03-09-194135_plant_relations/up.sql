-- Your SQL goes here
CREATE TABLE genus (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    CONSTRAINT genus_name_key UNIQUE (name)
);
CREATE TABLE subfamily (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    CONSTRAINT subfamily_name_key UNIQUE (name)
);
CREATE TABLE family (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    CONSTRAINT family_name_key UNIQUE (name)
);
ALTER TABLE plant_detail
ADD COLUMN genus_id INTEGER REFERENCES genus (id);
ALTER TABLE plant_detail
ADD COLUMN subfamily_id INTEGER REFERENCES subfamily (id);
ALTER TABLE plant_detail
ADD COLUMN family_id INTEGER REFERENCES family (id);
CREATE TYPE LIKE_TYPE AS ENUM ('plant', 'genus', 'family', 'subfamily');
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    from_id INTEGER NOT NULL,
    from_type LIKE_TYPE NOT NULL,
    to_id INTEGER NOT NULL,
    to_type LIKE_TYPE NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);
/*
 INSERT INTO genus (name)
 SELECT DISTINCT
 genus
 FROM plant_detail;
 
 INSERT INTO family (name)
 SELECT DISTINCT
 family
 FROM plant_detail
 WHERE family IS NOT NULL
 */