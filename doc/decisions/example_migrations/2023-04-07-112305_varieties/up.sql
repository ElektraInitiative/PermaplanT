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

-- Let's say carrots have a height of 0.3m and a white flower colour.
UPDATE plants
SET
    mature_size_height = '0.3',
    flower_colour = 'white'
WHERE binomial_name = 'Daucus carota';

-- There is a variety of it which grows higher but has the same flower_colour.
INSERT INTO varieties (plant_id, mature_size_height)
VALUES ((SELECT id FROM plants WHERE binomial_name = 'Daucus carota'), '0.5');

-- And another variety which has the same height but yellow flowers.
INSERT INTO varieties (plant_id, flower_colour)
VALUES ((SELECT id FROM plants WHERE binomial_name = 'Daucus carota'), 'yellow');

-- Get all plants without varieties.
SELECT
    id,
    binomial_name,
    mature_size_height,
    flower_colour
FROM plants;

-- Get all varities.
SELECT
    v.id,
    p.binomial_name,
    COALESCE(v.mature_size_height, p.mature_size_height),
    COALESCE(v.flower_colour, p.flower_colour)
FROM varieties AS v
LEFT JOIN plants p
    ON v.plant_id = p.id;

-- Get all plants and varieties.
SELECT
    p.id,
    p.binomial_name,
    p.mature_size_height,
    p.flower_colour
FROM plants AS p
UNION
SELECT
    v.id,
    p.binomial_name,
    COALESCE(v.mature_size_height, p.mature_size_height),
    COALESCE(v.flower_colour, p.flower_colour)
FROM varieties AS v
LEFT JOIN plants p
    ON v.plant_id = p.id;
