-- This file should undo anything in `up.sql`
ALTER TABLE seeds DROP COLUMN variety;

CREATE TABLE varieties ( 
  id SERIAL PRIMARY KEY,
  tags TEXT[] NOT NULL, -- if not given (via inserting an empty array: ARRAY[]::tag[]), plants take preference.
  species TEXT NOT NULL, -- German: Art
  variety TEXT -- German: Sorte
);

-- Add column without not null constraint.
ALTER TABLE seeds ADD COLUMN variety_id INTEGER REFERENCES varieties(id);
-- Then set all varieties to some default value .... 
INSERT INTO varieties (id, tags, species) VALUES (1, ARRAY['Default']::TEXT[], 'Default');
UPDATE seeds SET variety_id = 1;
-- ... before setting not null constraint.
ALTER TABLE seeds ALTER COLUMN variety_id SET NOT NULL;