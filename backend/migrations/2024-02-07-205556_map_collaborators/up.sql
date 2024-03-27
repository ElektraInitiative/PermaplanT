CREATE TABLE IF NOT EXISTS map_collaborators (
    map_id integer NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    FOREIGN KEY (map_id) REFERENCES maps (id) ON DELETE CASCADE,
    PRIMARY KEY (map_id, user_id)
);
