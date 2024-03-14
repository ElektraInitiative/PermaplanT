CREATE TYPE drawing_shape_kind AS ENUM (
    'rectangle',
    'ellipse',
    'free line',
    'bezier polygon'
);

CREATE TABLE drawings (
    id uuid PRIMARY KEY,
    kind drawing_shape_kind NOT NULL,
    layer_id integer NOT NULL,
    add_date date,
    remove_date date,
    rotation real NOT NULL,
    scale_x real NOT NULL,
    scale_y real NOT NULL,
    x integer NOT NULL,
    y integer NOT NULL,
    color varchar NOT NULL,
    fill_enabled boolean NOT NULL,
    stroke_width real NOT NULL,
    properties jsonb NOT NULL,
    CONSTRAINT fk_layer_id
    FOREIGN KEY (layer_id)
    REFERENCES layers (id)
);
