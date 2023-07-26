-- This migration already ran on www.permaplant.net
-- So it cannot be edited, except of comments or formatting.
-- Please create a new migration instead.

ALTER TABLE layers
DROP CONSTRAINT layers_map_id_fkey;

ALTER TABLE layers
ADD CONSTRAINT layers_map_id_fkey
FOREIGN KEY (map_id)
REFERENCES maps (id)
ON DELETE CASCADE;

ALTER TABLE plantings
DROP CONSTRAINT plantings_layer_id_fkey;

ALTER TABLE plantings
ADD CONSTRAINT plantings_layer_id_fkey
FOREIGN KEY (layer_id)
REFERENCES layers (id)
ON DELETE CASCADE;
