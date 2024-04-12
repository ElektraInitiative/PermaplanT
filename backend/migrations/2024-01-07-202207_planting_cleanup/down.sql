-- Rename the `size_x` column back to `width` and `size_y` back to `height`.
ALTER TABLE plantings RENAME COLUMN size_x TO width;
ALTER TABLE plantings RENAME COLUMN size_y TO height;

-- Add the `scale_x` and `scale_y` columns back.
ALTER TABLE plantings ADD COLUMN scale_x real NOT NULL DEFAULT 1.0;
ALTER TABLE plantings ADD COLUMN scale_y real NOT NULL DEFAULT 1.0;
