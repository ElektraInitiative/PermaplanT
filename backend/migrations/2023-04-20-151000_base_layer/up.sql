CREATE TABLE base_layers (
    id SERIAL PRIMARY KEY,
    base_image_url TEXT NOT NULL,             -- nextcloud URL providing the base image
    pixels_per_meter FLOAT NOT NULL,          -- used to convert from distances in the image to real distances
    north_orientation_degrees FLOAT NOT NULL  -- how much the image has to be rotated in degrees to be in line with geographic north
);