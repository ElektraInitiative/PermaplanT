-- Your SQL goes here
ALTER TABLE plant_detail
ADD COLUMN license VARCHAR;
ALTER TABLE plant_detail
ADD COLUMN article_last_modified_at TIMESTAMP;