-- Your SQL goes here
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE geometry_samples (
  id SERIAL PRIMARY KEY,
  point geometry(Point, 4326) NOT NULL,
  linestring geometry(Linestring, 4326) NOT NULL
);