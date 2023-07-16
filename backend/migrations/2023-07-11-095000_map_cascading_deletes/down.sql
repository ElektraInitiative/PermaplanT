-- This file should undo anything in `up.sql`
ALTER TABLE layers
DROP CONSTRAINT layers_map_id_fkey;

ALTER TABLE layers
ADD CONSTRAINT layers_map_id_fkey
FOREIGN KEY (map_id)
REFERENCES maps(id);

ALTER TABLE plantings
DROP CONSTRAINT plantings_layer_id_fkey;

ALTER TABLE plantings
ADD CONSTRAINT plantings_layer_id_fkey
FOREIGN KEY (layer_id)
REFERENCES layers(id);
