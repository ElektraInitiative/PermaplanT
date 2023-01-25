-- this up.sql file creates the varieties table and inserts some data

-- German: Sorten
CREATE TABLE varieties ( 
  id SERIAL PRIMARY KEY,
  tags TEXT[] NOT NULL, -- if not given (via inserting an empty array: ARRAY[]::tag[]), plants take preference.
  species TEXT NOT NULL, -- German: Art
  variety TEXT -- German: Sorte
);

INSERT INTO varieties (id, tags, species) VALUES (1, ARRAY['Fruit crops']::TEXT[], 'Wildtomate');
