-- Your SQL goes here

CREATE TYPE tag AS ENUM (
  'Leaf crops', -- German: Blattpflanzen
  'Fruit crops', -- German: Fruchtpflanzen
  'Root crops', -- German: Wurzelpflanzen
  'Flowering crops', -- German: Blütenpflanzen
  'Herbs', -- German: Kräuter
  'Other' -- German: Sonstiges
);

CREATE TYPE quality AS ENUM (
  'Organic',-- German: Bio
  'Not organic',-- German: Nicht-Bio
  'Unknown' -- German: unbekannt
);

CREATE TYPE quantity AS ENUM (
  'Nothing',-- German: Nichts
  'Not enough',-- German: Nicht Genug
  'Enough', -- German: Genug
  'More than enough' -- Mehr als genug
);
