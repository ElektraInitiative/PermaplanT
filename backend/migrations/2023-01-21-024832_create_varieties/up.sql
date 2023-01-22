-- Your SQL goes here

-- German: Sorten
CREATE TABLE varieties ( 
  id SERIAL PRIMARY KEY,
  tags TEXT[] NOT NULL, -- if not given (via inserting an empty array: ARRAY[]::tag[]), plants take preference.
  species VARCHAR(255) NOT NULL, -- German: Art
  variety VARCHAR(255) -- German: Sorte
);

INSERT INTO varieties (id, tags, species) VALUES (1, ARRAY['Fruit crops']::TEXT[], 'Wildtomate');
