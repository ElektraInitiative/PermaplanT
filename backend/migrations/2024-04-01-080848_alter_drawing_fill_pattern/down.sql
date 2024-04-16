ALTER TABLE drawings ADD COLUMN fill_enabled boolean;

UPDATE drawings SET fill_enabled = (fill_pattern != 'none');
ALTER TABLE drawings DROP COLUMN fill_pattern;

ALTER TABLE drawings ALTER COLUMN fill_enabled SET NOT NULL;
