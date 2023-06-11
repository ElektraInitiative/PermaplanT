-- Your SQL goes here
CREATE TABLE plantings (
    id SERIAL PRIMARY KEY,
    layer_id INTEGER NOT NULL,
    plant_id INTEGER NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    rotation REAL NOT NULL,
    scale_x REAL NOT NULL,
    scale_y REAL NOT NULL,
    FOREIGN KEY (layer_id) REFERENCES layers(id),
    FOREIGN KEY (plant_id) REFERENCES plants(id)
);

-- Create function to check LAYER_TYPE
CREATE OR REPLACE FUNCTION check_layer_type() RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT type FROM layers WHERE id = NEW.layer_id) != 'plants' THEN
        RAISE EXCEPTION 'Layer type must be "plants"';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before insert or update
CREATE TRIGGER check_layer_type_before_insert_or_update
BEFORE INSERT OR UPDATE ON plantings
FOR EACH ROW EXECUTE FUNCTION check_layer_type();
