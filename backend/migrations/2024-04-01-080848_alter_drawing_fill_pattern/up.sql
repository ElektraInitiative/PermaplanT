ALTER TABLE drawings ADD COLUMN fill_pattern text NOT NULL;
UPDATE drawings SET fill_pattern = CASE WHEN fill_enabled THEN 'solid' ELSE 'none' END;
ALTER TABLE drawings DROP COLUMN fill_enabled;
