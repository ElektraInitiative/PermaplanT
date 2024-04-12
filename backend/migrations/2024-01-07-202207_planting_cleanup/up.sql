-- Rename the `width` column to `size_x` and `height` to `size_y`.
ALTER TABLE plantings RENAME COLUMN width TO size_x;
ALTER TABLE plantings RENAME COLUMN height TO size_y;

-- Drop the `scale_x` and `scale_y` columns.
ALTER TABLE plantings DROP COLUMN scale_x;
ALTER TABLE plantings DROP COLUMN scale_y;
