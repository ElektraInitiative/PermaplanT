-- Your SQL goes here
ALTER TABLE maps
DROP COLUMN owner_id;
ALTER TABLE maps
ADD COLUMN owner_id UUID NOT NULL;
