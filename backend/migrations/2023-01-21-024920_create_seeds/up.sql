-- Your SQL goes here
CREATE TABLE seeds (
  id SERIAL PRIMARY KEY,
  tags TEXT[] NOT NULL, -- German: Kategorien
  name VARCHAR(255) NOT NULL, -- German: Art
  variety_id INTEGER REFERENCES varieties(id) NOT NULL,
  harvest_year SMALLINT NOT NULL, -- German: Erntejahr
  use_by DATE, -- German: Verbrauch Bis
  origin VARCHAR(255), -- German: Herkunft
  taste VARCHAR(255), -- German: Geschmack
  yield VARCHAR(255), -- German: Ertrag
  quantity VARCHAR(255) NOT NULL, -- German: Menge
  quality VARCHAR(255), -- German: Qualität
  price NUMERIC, -- German: Preis
  generation INTEGER, -- German: Generation
  notes TEXT -- German: Notizen,
);

ALTER TABLE seeds ADD CONSTRAINT CHK_seeds_tags CHECK (
  tags <@ ARRAY [
    'Leaf crops', -- German: Blattpflanzen
    'Fruit crops', -- German: Fruchtpflanzen
    'Root crops', -- German: Wurzelpflanzen
    'Flowering crops', -- German: Blütenpflanzen
    'Herbs', -- German: Kräuter
    'Other' -- German: Sonstiges
  ]
);

ALTER TABLE seeds ADD CONSTRAINT CHK_seeds_quality CHECK (
  quality IN (
    'Organic',-- German: Bio
    'Not organic',-- German: Nicht-Bio
    'Unknown' -- German: unbekannt
  )
);

ALTER TABLE seeds ADD CONSTRAINT CHK_seeds_quantity CHECK (
  quantity IN (
    'Nothing',-- German: Nichts
    'Not enough',-- German: Nicht Genug
    'Enough', -- German: Genug
    'More than enough' -- Mehr als genug
  )
);

-- This is only temporary so we can get some rows into the database
--INSERT INTO seeds (variety_id, tags, name, harvest_year, quantity) VALUES (1, ARRAY['Fruit crops']::tag[], 'Tomate', 2023, 'Enough');
INSERT INTO seeds (variety_id, name, harvest_year, tags, quantity) VALUES (1, 'Tomate', 2022, ARRAY['Fruit crops', 'Leaf crops'], 'Nothing');