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
INSERT INTO taxons (rank, name, parent_id)
VALUES ('family', 'Apiaceae', NULL) RETURNING id
),

carrot_subfamily AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'subfamily', 'Apioideae', carrot_family.id
FROM carrot_family RETURNING id
),

carrot_genus AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'genus', 'Daucus', carrot_subfamily.id
FROM carrot_subfamily RETURNING id
),

carrot_species AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'species', 'Daucus carota', carrot_genus.id
FROM carrot_genus RETURNING id
),

carrot AS (
INSERT INTO plants (binomial_name, common_name, family_id, subfamily_id, genus_id, species_id)
SELECT
'Daucus carota',
'{"Carrot"}',
(Select id from carrot_family),
(SELECT id FROM carrot_subfamily),
(SELECT id from carrot_genus),
(SELECT id from carrot_species)
RETURNING id
),

-- insert radish
radish_family AS (
INSERT INTO taxons (rank, name, parent_id)
VALUES ('family', 'Brassicaceae', NULL) RETURNING id
),

radish_genus AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'genus', 'Raphanus', radish_family.id
FROM radish_family RETURNING id
),

radish_species AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'species', 'Raphanus raphanistrum', radish_genus.id
FROM radish_genus RETURNING id
),

radish AS (
INSERT INTO plants (binomial_name, common_name, family_id, genus_id, species_id)
SELECT
'Raphanus raphanistrum',
'{"Radish"}',
(Select id from radish_family),
(SELECT id from radish_genus),
(SELECT id from radish_species)
RETURNING id
),

-- insert marigold
marigold_family AS (
INSERT INTO taxons (rank, name, parent_id)
VALUES ('family', 'Asteraceae', NULL) RETURNING id
),

marigold_subfamily AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'subfamily', 'Asteroideae', marigold_family.id
FROM marigold_family RETURNING id
),

marigold_genus AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'genus', 'Calendula', marigold_subfamily.id
FROM marigold_subfamily RETURNING id
),

marigold_species AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'species', 'Calendula officinalis', marigold_genus.id
FROM marigold_genus RETURNING id
),

marigold AS (
INSERT INTO plants (binomial_name, common_name, family_id, subfamily_id, genus_id, species_id)
SELECT
'Calendula officinalis',
'{"Marigold"}',
(Select id from marigold_family),
(SELECT id FROM marigold_subfamily),
(SELECT id from marigold_genus),
(SELECT id from marigold_species)
RETURNING id
),

-- insert potato
potato_family AS (
INSERT INTO taxons (rank, name, parent_id)
VALUES ('family', 'Solanaceae', NULL) RETURNING id
),

potato_subfamily AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'subfamily', 'Solanoideae', potato_family.id
FROM potato_family RETURNING id
),

potato_genus AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'genus', 'Solanum', potato_subfamily.id
FROM potato_subfamily RETURNING id
),

potato_species AS (
INSERT INTO taxons (rank, name, parent_id)
SELECT 'species', 'Solanum tuberosum', potato_genus.id
FROM potato_genus RETURNING id
),

potato AS (
INSERT INTO plants (binomial_name, common_name, family_id, subfamily_id, genus_id, species_id)
SELECT
'Solanum tuberosum',
'{"Potato"}',
(Select id from potato_family),
(SELECT id FROM potato_subfamily),
(SELECT id from potato_genus),
(SELECT id from potato_species)
FROM potato_species RETURNING id
)

INSERT INTO taxon_relationships (kind, strength, left_taxon_id, right_taxon_id)
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
r1.left_taxon_id AS taxon_id,
r1.kind
FROM taxon_relationships AS r1
WHERE r1.right_taxon_id IN (3, 7)
AND r1.left_taxon_id NOT IN (3, 7)
UNION
SELECT
r2.right_taxon_id AS taxon_id,
r2.kind
FROM taxon_relationships AS r2
WHERE r2.left_taxon_id IN (3, 7)
AND r2.right_taxon_id NOT IN (5, 7)
)

SELECT \*
FROM potential_companions companions
LEFT JOIN taxons AS t ON companions.taxon_id = t.id
LEFT JOIN plants AS p ON t.id IN (p.family_id, p.subfamily_id, p.genus_id, p.species_id)
-- Then we need to remove companions are antagonists as well
WHERE kind = 'companion'
AND NOT EXISTS (
SELECT 1
FROM potential_companions antagonists
WHERE kind = 'antagonist'
AND companions.taxon_id = antagonists.taxon_id
);

--
-- Example: Hierarchical information
--
-- Let's set an for the family of potato and one for the carrot species.
UPDATE taxons
SET icon_url = '/assets/img/solanaceae.png'
WHERE name = 'Solanaceae';
UPDATE taxons
SET icon_url = '/assets/img/daucus_carota.png'
WHERE name = 'Daucus carota';
-- Get all plants with their hierarchy information
SELECT
plants.common_name,
species.name,
genus.name,
subfamily.name,
family.name,
COALESCE(species.icon_url, genus.icon_url, subfamily.icon_url, family.icon_url) AS icon_url
FROM plants
LEFT JOIN taxons AS species
ON (species.rank = 'species' AND species.id = plants.species_id)
LEFT JOIN taxons AS genus
ON (genus.rank = 'genus' AND genus.id = plants.genus_id)
LEFT JOIN taxons AS subfamily
ON (subfamily.rank = 'subfamily' AND subfamily.id = plants.subfamily_id)
LEFT JOIN taxons AS family
ON (family.rank = 'family' AND family.id = plants.family_id);

--
-- Example: Varieties
--
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

-- Get all varieties.
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
