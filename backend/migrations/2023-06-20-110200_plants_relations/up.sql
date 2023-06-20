-- Your SQL goes here
CREATE TYPE RELATIONS_TYPE AS ENUM ('companion', 'neutral', 'antagonist');

CREATE TABLE relations (
    plant1 TEXT NOT NULL,
    plant2 TEXT NOT NULL,
    relation RELATIONS_TYPE NOT NULL,
    PRIMARY KEY (plant1, plant2),
    FOREIGN KEY (plant1) REFERENCES plants(unique_name),
    FOREIGN KEY (plant2) REFERENCES plants(unique_name)
)
