-- Your SQL goes here
CREATE TABLE shadings (
    id uuid PRIMARY KEY,
    layer_id integer NOT NULL,
    shade_type shade NOT NULL,
    geometry GEOMETRY (POLYGON, 4326) NOT NULL,
    add_date date,
    remove_date date,
    FOREIGN KEY (layer_id) REFERENCES layers (id) ON DELETE CASCADE
);

CREATE FUNCTION check_shade_layer_type() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF (SELECT type FROM layers WHERE id = NEW.layer_id) != 'shade' THEN
        RAISE EXCEPTION 'Layer type must be "shade"';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER check_shade_layer_type_before_insert_or_update
BEFORE INSERT OR UPDATE ON shadings
FOR EACH ROW EXECUTE FUNCTION check_shade_layer_type();
