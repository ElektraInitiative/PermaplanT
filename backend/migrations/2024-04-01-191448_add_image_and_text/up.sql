ALTER TYPE drawing_shape_type ADD VALUE 'label text';
ALTER TYPE drawing_shape_type ADD VALUE 'image';

ALTER TABLE drawings
DROP COLUMN color,
DROP COLUMN fill_pattern,
DROP COLUMN stroke_width;
