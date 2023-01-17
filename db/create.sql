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

CREATE TABLE varieties ( -- German: Sorten
  id SERIAL PRIMARY KEY,
  tags tag[] NOT NULL, -- if not given (via inserting an empty array: ARRAY[]::tag[]), plants take preference.
  species VARCHAR(255) NOT NULL, -- German: Art
  variety VARCHAR(255) -- German: Sorte
);

CREATE TABLE variety_synonyms (
  id SERIAL PRIMARY KEY,
  synonym_name VARCHAR(255) NOT NULL,
  variety_id INTEGER REFERENCES varieties(id) NOT NULL
);

CREATE TABLE seeds (
  id SERIAL PRIMARY KEY,
  tags tag[] NOT NULL, -- German: Kategorien
  name VARCHAR(255) NOT NULL, -- German: Name
  variety_id INTEGER REFERENCES varieties(id) NOT NULL,
  harvest_year SMALLINT NOT NULL, -- German: Erntejahr
  use_by DATE, -- German: Verbrauch Bis
  origin VARCHAR(255), -- German: Herkunft
  taste VARCHAR(255), -- German: Geschmack
  yield VARCHAR(255), -- German: Ertrag
  quantity quantity NOT NULL, -- German: Menge
  quality quality, -- German: Qualität
  price money, -- German: Preis
  generation INTEGER, -- German: Generation
  notes TEXT -- German: Notizen
);

-- Minimal insert examples
INSERT INTO varieties (id, tags, species) VALUES (1, ARRAY['Fruit crops']::tag[], 'Wildtomate');
INSERT INTO variety_synonyms (variety_id, synonym_name) VALUES (1, 'Tomate Synonym');
INSERT INTO seeds (variety_id, tags, name, harvest_year, quantity) VALUES (1, ARRAY['Fruit crops']::tag[], 'Tomate', 2023, 'Enough');