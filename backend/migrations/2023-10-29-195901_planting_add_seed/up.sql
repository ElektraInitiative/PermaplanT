ALTER TABLE plantings ADD COLUMN seed_id integer REFERENCES seeds (id);
