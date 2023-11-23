DROP TABLE plant_relationships;
DROP TYPE relationship_kind;
ALTER TABLE plants
DROP COLUMN family_id,
DROP COLUMN subfamily_id,
DROP COLUMN genus_id,
DROP COLUMN species_id;
DROP TYPE taxonomic_rank;
