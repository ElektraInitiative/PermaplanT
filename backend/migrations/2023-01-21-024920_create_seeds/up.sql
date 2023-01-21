-- Your SQL goes here
CREATE TABLE seeds (
  id SERIAL PRIMARY KEY,
  --tags tag[] NOT NULL, -- German: Kategorien
  name VARCHAR(255) NOT NULL, -- German: Art
  variety_id INTEGER REFERENCES varieties(id) NOT NULL
  --harvest_year SMALLINT NOT NULL, -- German: Erntejahr
  --use_by DATE, -- German: Verbrauch Bis
  --origin VARCHAR(255), -- German: Herkunft
  --taste VARCHAR(255), -- German: Geschmack
  --yield VARCHAR(255), -- German: Ertrag
  --quantity quantity NOT NULL, -- German: Menge
  --quality quality, -- German: Qualität
  --price money, -- German: Preis
  --generation INTEGER, -- German: Generation
  --notes TEXT -- German: Notizen
);

-- This is only temporary so we can get some rows into the database
INSERT INTO varieties (id, tags, species) VALUES (1, ARRAY['Fruit crops']::tag[], 'Wildtomate');
--INSERT INTO seeds (variety_id, tags, name, harvest_year, quantity) VALUES (1, ARRAY['Fruit crops']::tag[], 'Tomate', 2023, 'Enough');
INSERT INTO seeds (variety_id, name) VALUES (1, 'Tomate');