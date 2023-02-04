CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  url VARCHAR,
  name VARCHAR NOT NULL,
  CONSTRAINT plants_name_ukey UNIQUE (name)
);