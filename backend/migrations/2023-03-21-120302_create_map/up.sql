-- Your SQL goes here
CREATE TABLE map (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);