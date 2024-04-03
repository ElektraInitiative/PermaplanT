ALTER TABLE drawings DROP CONSTRAINT IF EXISTS check_single_drawing_type;


DROP TABLE IF EXISTS image_drawings;
DROP TABLE IF EXISTS labeltext_drawings;
DROP TABLE IF EXISTS freeline_drawings;
DROP TABLE IF EXISTS polygon_drawings;
DROP TABLE IF EXISTS ellipse_drawings;
DROP TABLE IF EXISTS rectangle_drawings;

DROP TABLE IF EXISTS drawings;
DROP TYPE IF EXISTS drawing_shape_type;

DROP FUNCTION IF EXISTS validate_drawings_variant_exists;
