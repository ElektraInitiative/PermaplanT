-- Your SQL goes here
ALTER TABLE seeds DROP COLUMN variety_id;
DROP TABLE varieties;

ALTER TABLE seeds ADD COLUMN variety TEXT;
