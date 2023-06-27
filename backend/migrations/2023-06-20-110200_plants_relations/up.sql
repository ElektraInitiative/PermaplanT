-- Your SQL goes here
CREATE TYPE relation_type AS ENUM ('companion', 'neutral', 'antagonist');

CREATE TABLE relations (
    plant1 INTEGER NOT NULL,
    plant2 INTEGER NOT NULL,
    relation relation_type NOT NULL,
    note TEXT,
    PRIMARY KEY (plant1, plant2),
    FOREIGN KEY (plant1) REFERENCES plants(id),
    FOREIGN KEY (plant2) REFERENCES plants(id)
)
