-- returns all components of a seeds complete name along with its id and owner id.
CREATE OR REPLACE VIEW seeds_name_view AS
SELECT
    seeds.id AS id,
    plants.common_name_en AS common_name_en,
    plants.common_name_de AS common_name_de,
    plants.unique_name AS unique_name,
    seeds.name AS additional_name
FROM seeds INNER JOIN plants ON seeds.plant_id = plants.id;
