-- Your SQL goes here

-- German: Sorten
CREATE TABLE varieties ( 
  id SERIAL PRIMARY KEY,
  tags tag[] NOT NULL, -- if not given (via inserting an empty array: ARRAY[]::tag[]), plants take preference.
  species VARCHAR(255) NOT NULL, -- German: Art
  variety VARCHAR(255) -- German: Sorte
);
