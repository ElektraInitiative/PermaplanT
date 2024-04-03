CREATE TYPE drawing_shape_type AS ENUM (
    'rectangle',
    'ellipse',
    'free line',
    'polygon',
    'label text',
    'image'
);

CREATE TABLE drawings (
    id uuid PRIMARY KEY,
    layer_id integer NOT NULL,
    shape_type drawing_shape_type NOT NULL,
    -- referece to an id of one of the %_drawings tables
    properties_id uuid NOT NULL,
    add_date date,
    remove_date date,
    rotation real NOT NULL,
    scale_x real NOT NULL,
    scale_y real NOT NULL,
    x integer NOT NULL,
    y integer NOT NULL,

    CONSTRAINT fk_layer_id
    FOREIGN KEY (layer_id)
    REFERENCES layers (id)
);


-- Drawing properties

CREATE TABLE rectangle_drawings (
    id uuid PRIMARY KEY,
    width float,
    height float,
    color text,
    fill_pattern text,
    stroke_width float
);

CREATE TABLE ellipse_drawings (
    id uuid PRIMARY KEY,
    radius_x float,
    radius_y float,
    color text,
    fill_pattern text,
    stroke_width float
);

CREATE TABLE freeline_drawings (
    id uuid PRIMARY KEY,
    points jsonb,
    color text,
    fill_pattern text,
    stroke_width float
);

CREATE TABLE polygon_drawings (
    id uuid PRIMARY KEY,
    points jsonb,
    color text,
    fill_pattern text,
    stroke_width float
);

CREATE TABLE labeltext_drawings (
    id uuid PRIMARY KEY,
    text text,
    width int,
    height int,
    color text
);

CREATE TABLE image_drawings (
    id uuid PRIMARY KEY,
    path text
);


-- Ensure data integrity by checking the correct variant of drawings
-- exists.
CREATE OR REPLACE FUNCTION validate_drawings_variant_exists()
RETURNS trigger AS $$
DECLARE
    exists boolean;
BEGIN
    exists := FALSE;

    CASE NEW.shape_type
        WHEN 'rectangle' THEN
            exists := EXISTS (SELECT 1 FROM rectangle_drawings WHERE id = NEW.properties_id);
        WHEN 'ellipse' THEN
            exists := EXISTS (SELECT 1 FROM ellipse_drawings WHERE id = NEW.properties_id);
        WHEN 'free line' THEN
            exists := EXISTS (SELECT 1 FROM freeline_drawings WHERE id = NEW.properties_id);
        WHEN 'polygon' THEN
            exists := EXISTS (SELECT 1 FROM polygon_drawings WHERE id = NEW.properties_id);
        WHEN 'label text' THEN
            exists := EXISTS (SELECT 1 FROM labeltext_drawings WHERE id = NEW.properties_id);
        WHEN 'image' THEN
            exists := EXISTS (SELECT 1 FROM image_drawings WHERE id = NEW.properties_id);
    END CASE;

    IF NOT exists THEN
        RAISE EXCEPTION 'No matching entry for type %', NEW.shape_type;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_drawings_variant_exists
AFTER INSERT OR UPDATE ON drawings
FOR EACH ROW
EXECUTE FUNCTION validate_drawings_variant_exists();
