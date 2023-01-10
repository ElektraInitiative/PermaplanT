CREATE TYPE tag AS ENUM (
  'Leaf crops',  -- Blattgemüse
  'Fruit crops', -- Fruchtpflanzen
  'Root crops', -- Wurzelpflanzen
  'Flowering crops', -- Blütenpflanzen
  'Herbs', -- Kräuter
  'Other' -- Sonstiges
);

CREATE TYPE quality AS ENUM (
  'Organic', -- Bio
  'Not organic', -- Nicht-Bio
  'Unknown' -- unbekannt
);

CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  tag tag[] NOT NULL,
  type VARCHAR(255) NOT NULL,
  synonym VARCHAR(255),
  sowing DATE,
  sowing_depth INTEGER, -- depth in cm
  germination_temperature INTEGER,
  prick_out INTEGER,
  transplant INTEGER,
  row_spacing INTEGER,
  plant_density INTEGER,
  germination_time INTEGER,
  harvest_time DATE,
  location VARCHAR(255),
  care VARCHAR(255),
  height INTEGER
);

CREATE TABLE seeds (
  id SERIAL PRIMARY KEY,
  tag tag[] NOT NULL,
  type VARCHAR(255) NOT NULL,
  plant_id INTEGER REFERENCES plants(id) NOT NULL,
  harvest_year INTEGER NOT NULL,
  use_by DATE,
  origin VARCHAR(255),
  flavor VARCHAR(255),
  yield INTEGER,
  quantity INTEGER,
  quality quality,
  price NUMERIC(10, 2),
  generation INTEGER,
  notes TEXT
);
