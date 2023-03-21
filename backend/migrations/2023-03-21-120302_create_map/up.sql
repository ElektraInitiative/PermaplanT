-- Your SQL goes here
CREATE TABLE map (
  id SERIAL PRIMARY KEY,
  detail JSON,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);