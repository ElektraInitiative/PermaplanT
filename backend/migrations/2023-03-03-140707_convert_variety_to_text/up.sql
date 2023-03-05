-- Your SQL goes here
ALTER TABLE seeds DROP COLUMN variety_id;
DROP TABLE varieties;

-- Add column without not null constraint.
ALTER TABLE seeds ADD COLUMN variety TEXT;
-- Then set all varieties to some default value .... 
UPDATE seeds SET variety = 'Default';
-- ... before setting not null constraint.
ALTER TABLE seeds ALTER COLUMN variety SET NOT NULL;
