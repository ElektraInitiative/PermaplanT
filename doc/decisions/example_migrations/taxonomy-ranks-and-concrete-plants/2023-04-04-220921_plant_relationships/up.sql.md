CREATE TYPE relationship_kind AS ENUM ('companion', 'antagonist');
CREATE TABLE taxon_relationships (
id SERIAL PRIMARY KEY NOT NULL,
strength INTEGER CHECK (strength >= 0) NOT NULL,
kind relationship_kind NOT NULL,
left_taxon_id INTEGER REFERENCES taxons (id) NOT NULL,
right_taxon_id INTEGER REFERENCES taxons (id) NOT NULL
);
