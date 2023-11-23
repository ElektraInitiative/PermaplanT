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
ALTER TABLE plants
ADD CONSTRAINT plants_genus_fkey FOREIGN KEY (genus) REFERENCES genus (name);
ALTER TABLE plants
ADD CONSTRAINT plants_subfamily_fkey FOREIGN KEY (
subfamily
) REFERENCES subfamily (name);
ALTER TABLE plants
ADD CONSTRAINT plants_family_fkey FOREIGN KEY (family) REFERENCES family (name);
CREATE TYPE relation_type AS ENUM ('companion', 'antagonist', 'neutral');
CREATE TYPE hierarchy_level_type AS ENUM (
'plant', 'genus', 'subfamily', 'family'
);
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
CHECK (
relation_strength >= 0
AND relation_strength <= 3
),
CONSTRAINT relations_from_id_from_type_to_id_to_type_key UNIQUE (
from_id, from_type, to_id, to_type
)
);
