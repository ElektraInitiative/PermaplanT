ALTER TYPE drawing_shape_type RENAME TO drawing_shape_type_old;

CREATE TYPE drawing_shape_type AS ENUM (
    'rectangle',
    'ellipse',
    'free line',
    'bezier polygon'
);

ALTER TABLE drawings ALTER COLUMN shape_type TYPE drawing_shape_type USING shape_type::text::drawing_shape_type;

DROP TYPE drawing_shape_type_old;

ALTER TABLE drawings
ADD COLUMN color varchar,
ADD COLUMN fill_enabled boolean,
ADD COLUMN stroke_width real;

UPDATE drawings
SET
    color = '',
    fill_enabled = false,
    stroke_width = 1.0;


ALTER TABLE drawings ALTER COLUMN color SET NOT NULL;
ALTER TABLE drawings ALTER COLUMN fill_enabled SET NOT NULL;
ALTER TABLE drawings ALTER COLUMN stroke_width SET NOT NULL;
