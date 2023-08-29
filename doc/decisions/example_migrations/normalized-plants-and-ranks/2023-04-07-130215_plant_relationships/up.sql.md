CREATE TYPE taxonomic_rank AS ENUM ('family', 'subfamily', 'genus', 'species', 'variety');
ALTER TABLE plants
ADD COLUMN rank TAXONOMIC_RANK NOT NULL,
ADD COLUMN family_id INTEGER REFERENCES plants (id) NULL,
ADD COLUMN subfamily_id INTEGER REFERENCES plants (id) NULL,
ADD COLUMN genus_id INTEGER REFERENCES plants (id) NULL,
ADD COLUMN species_id INTEGER REFERENCES plants (id) NULL;

CREATE TYPE relationship_kind AS ENUM ('companion', 'antagonist', 'neutral');
CREATE TABLE plant_relationships (
id SERIAL PRIMARY KEY NOT NULL,
confidence INTEGER CHECK (confidence >= 0) NOT NULL,
kind relationship_kind NOT NULL,
left_plant_id INTEGER REFERENCES plants (id) NOT NULL,
right_plant_id INTEGER REFERENCES plants (id) NOT NULL
);
