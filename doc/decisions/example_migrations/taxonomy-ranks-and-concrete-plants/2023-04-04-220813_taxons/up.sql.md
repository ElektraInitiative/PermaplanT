CREATE TYPE taxonomic_rank AS ENUM ('family', 'subfamily', 'genus', 'species');
CREATE TABLE taxons (
id SERIAL PRIMARY KEY NOT NULL,
rank TAXONOMIC_RANK NOT NULL,
name VARCHAR NOT NULL,
icon_url VARCHAR NULL,
parent_id INTEGER REFERENCES taxons (id) NULL
);

-- TODO: drop taxonomic names in plants (family, subfamily, genus, species)
ALTER TABLE plants
ADD COLUMN family_id INTEGER REFERENCES taxons (id) NOT NULL,
ADD COLUMN subfamily_id INTEGER REFERENCES taxons (id) NULL,
ADD COLUMN genus_id INTEGER REFERENCES taxons (id) NOT NULL,
ADD COLUMN species_id INTEGER REFERENCES taxons (id) NOT NULL;
