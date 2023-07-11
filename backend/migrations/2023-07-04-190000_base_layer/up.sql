-- Your SQL goes here
CREATE TABLE base_layer_images (
    id UUID PRIMARY KEY,
    layer_id INTEGER NOT NULL,
    path TEXT NOT NULL,
    rotation REAL NOT NULL,
    scale REAL NOT NULL,
    FOREIGN KEY (layer_id) REFERENCES layers(id) ON DELETE CASCADE
);
