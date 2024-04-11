ALTER TYPE drawing_shape_type DROP VALUE 'label text';
ALTER TYPE drawing_shape_type DROP VALUE 'image';

ALTER TABLE drawings
ADD COLUMN color varchar NOT NULL,
ADD COLUMN fill_pattern boolean NOT NULL,
ADD COLUMN stroke_width real NOT NULL;
