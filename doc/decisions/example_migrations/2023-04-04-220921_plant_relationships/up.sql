CREATE TYPE taxonomic_rank AS ENUM ('family', 'subfamily', 'genus', 'species');
CREATE TABLE taxons (
    id SERIAL PRIMARY KEY NOT NULL,
    rank TAXONOMIC_RANK NOT NULL,
    name VARCHAR NOT NULL,
    parent_id INTEGER REFERENCES taxons (id) NULL
);

CREATE TYPE relationship_kind AS ENUM ('companion', 'antagonist');
CREATE TABLE relationships (
    id SERIAL PRIMARY KEY NOT NULL,
    strength INTEGER CHECK (strength >= 0) NOT NULL,
    kind relationship_kind NOT NULL,
    left_taxon_id INTEGER REFERENCES taxons (id) NOT NULL,
    right_taxon_id INTEGER REFERENCES taxons (id) NOT NULL
);

ALTER TABLE plants ADD COLUMN taxon_id INTEGER REFERENCES taxons (id) NOT NULL;

-- Example
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
    INSERT INTO plants (binomial_name, common_name, taxon_id)
    SELECT 'Daucus carota', '{"Carrot"}', carrot_species.id
    FROM carrot_species RETURNING id
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
    INSERT INTO plants (binomial_name, common_name, taxon_id)
    SELECT 'Raphanus raphanistrum', '{"Radish"}', radish_species.id
    FROM radish_species RETURNING id
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
    INSERT INTO plants (binomial_name, common_name, taxon_id)
    SELECT 'Calendula officinalis', '{"Marigold"}', marigold_species.id
    FROM marigold_species RETURNING id
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
    INSERT INTO plants (binomial_name, common_name, taxon_id)
    SELECT 'Solanum tuberosum', '{"Potato"}', potato_species.id
    FROM potato_species RETURNING id
)

INSERT INTO relationships (kind, strength, left_taxon_id, right_taxon_id)
-- Radish <-> carrot
VALUES (
    'companion', 1, (SELECT id FROM radish_species), (SELECT id FROM carrot_species)
),
-- Radish <-> potato
(
    'companion', 1, (SELECT id FROM radish_species), (SELECT id FROM potato_species)
),
-- Carrot >-< potato
(
    'antagonist', 1, (SELECT id FROM carrot_species), (SELECT id FROM potato_species)
),
-- Marigold <-> carrot
(
    'companion', 1, (SELECT id FROM marigold_species), (SELECT id FROM carrot_species)
),
-- Marigold <-> radish
(
    'companion', 1, (SELECT id FROM marigold_species), (SELECT id FROM radish_species)
);

--
-- Let's look for companions that go well with carrot and radish
--
-- First we get related plants which are not in the set we already have
WITH potential_companions AS (
    SELECT
        r1.left_taxon_id AS taxon_id,
        r1.kind
    FROM relationships AS r1
    WHERE
        r1.right_taxon_id IN (3, 7)
        AND r1.left_taxon_id NOT IN (3, 7)
    UNION
    SELECT
        r2.right_taxon_id AS taxon_id,
        r2.kind
    FROM relationships AS r2
    WHERE
        r2.left_taxon_id IN (3, 7)
        AND r2.right_taxon_id NOT IN (5, 7)
)

SELECT *
FROM potential_companions companions
LEFT JOIN taxons AS t ON companions.taxon_id = t.id
LEFT JOIN plants AS p ON t.id = p.taxon_id
-- Then we need to remove companions are antagonists as well
WHERE
    kind = 'companion'
    AND NOT EXISTS (
        SELECT 1
        FROM potential_companions antagonists
        WHERE
            kind = 'antagonist'
            AND companions.taxon_id = antagonists.taxon_id
    );

--
-- Other example queries
--
-- Get all plantss with their hierarchy information
SELECT
    plants.common_name,
    species.name,
    genus.name,
    subfamily.name,
    family.name
FROM plants
LEFT JOIN
    taxons AS species
    ON (species.rank = 'species' AND species.id = plants.taxon_id)
LEFT JOIN
    taxons AS genus
    ON (genus.rank = 'genus' AND genus.id = species.parent_id)
LEFT JOIN
    taxons AS subfamily
    ON (subfamily.rank = 'subfamily' AND subfamily.id = genus.parent_id)
-- Some genera don't belong to a subfamily so we might need to hop one level it.
LEFT JOIN
    taxons AS family
    ON (family.rank = 'family' AND (family.id = subfamily.parent_id OR family.id = genus.parent_id));
