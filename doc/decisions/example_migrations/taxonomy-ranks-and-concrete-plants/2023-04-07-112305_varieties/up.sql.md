--
-- This illustrates how column overrides could be done for plant varieties.
-- The example only shows how it would work for two columns.
-- It could easily be extended to other columns.
--
CREATE TABLE varieties (
id SERIAL PRIMARY KEY NOT NULL,
plant_id INTEGER REFERENCES plants (id),
mature_size_height VARCHAR,
flower_colour VARCHAR
);
