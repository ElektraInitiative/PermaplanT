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
CREATE TYPE RELATION_TYPE AS ENUM ('likes', 'dislikes');
CREATE TYPE HIERARCHY_LEVEL_TYPE AS ENUM ('plant', 'genus', 'subfamily', 'family');
CREATE TABLE relations (
    id SERIAL PRIMARY KEY,
    from_id INTEGER NOT NULL,
    from_type HIERARCHY_LEVEL_TYPE NOT NULL,
    to_id INTEGER NOT NULL,
    to_type HIERARCHY_LEVEL_TYPE NOT NULL,
    relation_type RELATION_TYPE NOT NULL,
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
 
 UPDATE plant_detail pd
 SET
 genus_id = g.id
 FROM genus g
 WHERE pd.genus = g.name;
 
 UPDATE plant_detail pd
 SET
 family_id = f.id
 FROM family f
 WHERE pd.family = f.name;
 
 UPDATE plant_detail pd
 SET
 subfamily_id = sf.id
 FROM subfamily sf
 WHERE pd.subfamily = sf.name;
 */