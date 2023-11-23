--
-- Example: Relationships
--
-- For this example we use the following notation
-- companion "<->"
-- antagonist ">-<"
-- Consider the following relationships between plants:
-- Radish <-> carrot
-- Radish <-> potato
-- Carrot >-< potato
-- Marigold <-> carrot
-- Marigold <-> radish
--
-- We want to plant carrots and radish and get suggestions for it.
-- When looking for companions we would expect the result just to be marigold.
-- Potato wouldn't be in the result since it's an antagonist to carrot.
--
-- Let's insert the plants.
-- insert carrot
WITH carrot_family AS (
INSERT INTO plants (rank, binomial_name)
VALUES ('family', 'Apiaceae') RETURNING id
),

carrot_subfamily AS (
INSERT INTO plants (rank, binomial_name, family_id)
VALUES ('subfamily', 'Apioideae', (SELECT id FROM carrot_family))
RETURNING id
),

carrot_genus AS (
INSERT INTO plants (rank, binomial_name, family_id, subfamily_id)
VALUES (
'genus',
-- TODO: rename to latin_name
'Daucus',
(SELECT id from carrot_family),
(SELECT id from carrot_subfamily)
)
RETURNING id
),

carrot_species AS (
INSERT INTO plants (rank, binomial_name, common_name, family_id, subfamily_id, genus_id)
VALUES (
'species',
'Daucus carota',
'{"Carrot"}',
(SELECT id from carrot_family),
(SELECT id from carrot_subfamily),
(SELECT id from carrot_genus)
)
RETURNING id
),

-- insert radish
radish_family AS (
INSERT INTO plants (rank, binomial_name)
VALUES ('family', 'Brassicaceae') RETURNING id
),

radish_genus AS (
INSERT INTO plants (rank, binomial_name, family_id)
VALUES ('genus', 'Raphanus', (SELECT id FROM radish_family))
RETURNING id
),

radish_species AS (
INSERT INTO plants (rank, binomial_name, common_name, family_id, genus_id)
VALUES (
'species',
'Raphanus raphanistrum',
'{"Radish"}',
(SELECT id from radish_family),
(SELECT id from radish_genus)
)
RETURNING id
),

-- insert marigold
marigold_family AS (
INSERT INTO plants (rank, binomial_name)
VALUES ('family', 'Asteraceae') RETURNING id
),

marigold_subfamily AS (
INSERT INTO plants (rank, binomial_name, family_id)
VALUES ('subfamily', 'Asteroideae', (SELECT id FROM marigold_family))
RETURNING id
),

marigold_genus AS (
INSERT INTO plants (rank, binomial_name, family_id, subfamily_id)
VALUES (
'genus',
'Calendula',
(SELECT id from marigold_family),
(SELECT id from marigold_subfamily)
)
RETURNING id
),

marigold_species AS (
INSERT INTO plants (rank, binomial_name, common_name, family_id, subfamily_id, genus_id)
VALUES (
'species',
'Calendula officinalis',
'{"Marigold"}',
(SELECT id from marigold_family),
(SELECT id from marigold_subfamily),
(SELECT id from marigold_genus)
)
RETURNING id
),

-- insert potato
potato_family AS (
INSERT INTO plants (rank, binomial_name)
VALUES ('family', 'Solanaceae') RETURNING id
),

potato_subfamily AS (
INSERT INTO plants (rank, binomial_name, family_id)
VALUES ('subfamily', 'Solanoideae', (SELECT id FROM potato_family))
RETURNING id
),

potato_genus AS (
INSERT INTO plants (rank, binomial_name, family_id, subfamily_id)
VALUES (
'genus',
'Solanum',
(SELECT id from potato_family),
(SELECT id from potato_subfamily)
)
RETURNING id
),

potato_species AS (
INSERT INTO plants (rank, binomial_name, common_name, family_id, subfamily_id, genus_id)
VALUES (
'species',
'Solanum tuberosum',
'{"Potato"}',
(SELECT id from potato_family),
(SELECT id from potato_subfamily),
(SELECT id from potato_genus)
)
RETURNING id
)

INSERT INTO plant_relationships (kind, confidence, left_plant_id, right_plant_id)
-- Radish <-> carrot
VALUES
('companion', 1, (SELECT id FROM radish_species), (SELECT id FROM carrot_species)),
-- Radish <-> potato
('companion', 1, (SELECT id FROM radish_species), (SELECT id FROM potato_species)),
-- Carrot >-< potato
('antagonist', 1, (SELECT id FROM carrot_species), (SELECT id FROM potato_species)),
-- Marigold <-> carrot
('companion', 1, (SELECT id FROM marigold_species), (SELECT id FROM carrot_species)),
-- Marigold <-> radish
('companion', 1, (SELECT id FROM marigold_species), (SELECT id FROM radish_species));

## -- Let's look for companions that go well with carrot and radish

-- First we get related plants which are not in the set we already have
WITH potential_companions AS (
SELECT
r1.left_plant_id AS plant_id,
r1.kind
FROM plant_relationships AS r1
WHERE r1.right_plant_id IN (4, 1)
AND r1.left_plant_id NOT IN (4, 1)
UNION
SELECT
r2.right_plant_id AS plant_id,
r2.kind
FROM plant_relationships AS r2
WHERE r2.left_plant_id IN (4, 1)
AND r2.right_plant_id NOT IN (4, 1)
)

SELECT \*
FROM plants AS p
RIGHT JOIN potential_companions AS companions ON companions.plant_id IN (p.id, p.family_id, p.subfamily_id, p.genus_id, p.species_id)
-- Then we need to remove companions are antagonists as well
WHERE kind = 'companion'
AND NOT EXISTS (
SELECT 1
FROM potential_companions AS antagonists
WHERE kind = 'antagonist'
AND companions.plant_id = antagonists.plant_id
);

--
-- Example: Hierarchical Information (Varieties)
--
-- Let's say carrots have a height of 0.3m and a white flower colour.
UPDATE plants
SET
mature_size_height = '0.3',
flower_colour = 'white'
WHERE binomial_name = 'Daucus carota';

-- Let's insert some varieteis.
WITH carrot_species AS (
SELECT \* FROM plants WHERE binomial_name = 'Daucus carota'
)
INSERT INTO plants (
binomial_name,
rank,
family_id,
subfamily_id,
genus_id,
species_id,
mature_size_height,
flower_colour
)
-- There is a variety of it which grows higher but has the same flower_colour.
VALUES (
'Daucus carota var. magna',
'variety',
(SELECT family_id FROM carrot_species),
(SELECT subfamily_id FROM carrot_species),
(SELECT genus_id FROM carrot_species),
(SELECT id FROM carrot_species),
'0.5',
NULL
),
-- And another variety which has the same height but yellow flowers.
(
'Daucus carota var. solis',
'variety',
(SELECT family_id FROM carrot_species),
(SELECT subfamily_id FROM carrot_species),
(SELECT genus_id FROM carrot_species),
(SELECT id FROM carrot_species),
NULL,
'yellow'
);

-- Get all plants and varieties while inheriting information for higher levels.
SELECT
p.id,
p.binomial_name,
COALESCE(p.mature_size_height, s.mature_size_height, g.mature_size_height, sf.mature_size_height, f.mature_size_height),
COALESCE(p.flower_colour, s.flower_colour, g.flower_colour, sf.flower_colour, f.flower_colour)
FROM plants AS p
LEFT JOIN plants AS s ON p.species_id = s.id
LEFT JOIN plants AS g ON p.genus_id = s.id
LEFT JOIN plants AS sf ON p.subfamily_id = s.id
LEFT JOIN plants AS f ON p.family_id = s.id
WHERE p.rank IN ('species', 'variety');
