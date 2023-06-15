-- This file should undo anything in `up.sql`
-- Drop the trigger
DROP TRIGGER IF EXISTS check_layer_type_before_insert_or_update ON plantings;

-- Drop the function
DROP FUNCTION IF EXISTS check_layer_type();

-- Drop the plantings table
DROP TABLE IF EXISTS plantings;
