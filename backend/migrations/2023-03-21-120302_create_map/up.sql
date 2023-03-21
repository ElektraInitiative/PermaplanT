-- Your SQL goes here
CREATE TABLE map (
  id SERIAL PRIMARY KEY,
  detail JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);