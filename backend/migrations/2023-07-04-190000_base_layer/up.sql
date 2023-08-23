-- This migration already ran on www.permaplant.net
-- So it cannot be edited, except of comments or formatting.
-- Please create a new migration instead.

CREATE TABLE base_layer_images (
    id uuid PRIMARY KEY,
    layer_id integer NOT NULL,
    path text NOT NULL,
    rotation real NOT NULL,
    scale real NOT NULL,
    FOREIGN KEY (layer_id) REFERENCES layers (id) ON DELETE CASCADE
);
