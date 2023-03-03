-- This file should undo anything in `up.sql`
CREATE TYPE tag AS ENUM (
  'Leaf crops', -- German: Blattpflanzen
  'Fruit crops', -- German: Fruchtpflanzen
  'Root crops', -- German: Wurzelpflanzen
  'Flowering crops', -- German: Blütenpflanzen
  'Herbs', -- German: Kräuter
  'Other' -- German: Sonstiges
);

ALTER TABLE seeds ADD COLUMN tags Tag[];