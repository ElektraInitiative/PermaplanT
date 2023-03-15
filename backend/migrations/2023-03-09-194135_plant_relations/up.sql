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
ADD CONSTRAINT plant_detail_genus_fkey FOREIGN KEY (genus) REFERENCES genus (name);
ALTER TABLE plant_detail
ADD CONSTRAINT plant_detail_subfamily_fkey FOREIGN KEY (subfamily) REFERENCES subfamily (name);
ALTER TABLE plant_detail
ADD CONSTRAINT plant_detail_family_fkey FOREIGN KEY (family) REFERENCES family (name);
CREATE TYPE RELATION_TYPE AS ENUM ('companion', 'antagonist', 'neutral');
CREATE TYPE HIERARCHY_LEVEL_TYPE AS ENUM ('plant', 'genus', 'subfamily', 'family');
CREATE TABLE relations (
    id SERIAL PRIMARY KEY,
    from_id INTEGER NOT NULL,
    from_type HIERARCHY_LEVEL_TYPE NOT NULL,
    to_id INTEGER NOT NULL,
    to_type HIERARCHY_LEVEL_TYPE NOT NULL,
    relation_type RELATION_TYPE NOT NULL,
    relation_strength INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    CHECK(
        relation_strength >= 0
        AND relation_strength <= 3
    )
);