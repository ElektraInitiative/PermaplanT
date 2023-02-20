-- Your SQL goes here
CREATE TABLE family (
  id SERIAL PRIMARY KEY,
  binomial_name VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT family_detail_binomial_name_key UNIQUE (binomial_name)
);
CREATE TABLE subfamily (
  id SERIAL PRIMARY KEY,
  binomial_name VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  family_id INTEGER REFERENCES family (id),
  CONSTRAINT subfamily_detail_binomial_name_key UNIQUE (binomial_name)
);
CREATE TABLE genus (
  id SERIAL PRIMARY KEY,
  binomial_name VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  subfamily_id INTEGER REFERENCES subfamily (id),
  CONSTRAINT genus_detail_binomial_name_key UNIQUE (binomial_name)
);
CREATE TABLE species (
  id SERIAL PRIMARY KEY,
  binomial_name VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  genus_id INTEGER REFERENCES genus (id),
  CONSTRAINT species_binomial_name_key UNIQUE (binomial_name)
);
ALTER TABLE plant_detail
ADD COLUMN species_id INTEGER REFERENCES species (id);