-- Your SQL goes here
CREATE TYPE LAYER_TYPE AS ENUM ('base', 'soil', 'todo', 'label', 'paths', 'photo', 'shade', 'trees', 'winds', 'zones', 'plants', 'drawing', 'terrain', 'habitats', 'warnings', 'watering', 'landscape', 'hydrology', 'fertilization', 'infrastructure');
CREATE TABLE layers (
    id SERIAL PRIMARY KEY,
    map_id INTEGER REFERENCES maps(id) NOT NULL,
    type LAYER_TYPE NOT NULL,
    name TEXT NOT NULL,
    is_alternative BOOLEAN NOT NULL
)
