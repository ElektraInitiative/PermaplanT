-- this up.sql file creates the seeds table and inserts some data

CREATE TABLE seeds (
  id SERIAL PRIMARY KEY,
  tags Tag[], -- German: Kategorien
  name TEXT NOT NULL, -- German: Art
  variety_id INTEGER REFERENCES varieties(id) NOT NULL,
  harvest_year SMALLINT NOT NULL, -- German: Erntejahr
  use_by DATE, -- German: Verbrauch Bis
  origin TEXT, -- German: Herkunft
  taste TEXT, -- German: Geschmack
  yield TEXT, -- German: Ertrag
  quantity Quantity NOT NULL, -- German: Menge
  quality Quality, -- German: Qualität
  price SMALLINT, -- in cents, German: Preis
  generation SMALLINT, -- German: Generation
  notes TEXT -- German: Notizen,
);

-- This is only temporary so we can get some rows into the database
INSERT INTO seeds (variety_id, tags, name, harvest_year, quantity) VALUES (1, ARRAY['Fruit crops']::tag[], 'Tomate', 2023, 'Enough');
