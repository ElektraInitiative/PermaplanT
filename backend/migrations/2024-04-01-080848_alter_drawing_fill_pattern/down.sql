ALTER TABLE drawings ADD COLUMN fill_enabled boolean NOT NULL;
UPDATE drawings SET fill_enabled = NOT coalesce(fill_pattern = 'none', false);
ALTER TABLE drawings DROP COLUMN fill_pattern;
