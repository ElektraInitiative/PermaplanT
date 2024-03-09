--
-- Only add database comments in this migration.
--

COMMENT ON TABLE layers IS 'The layers of a map';

COMMENT ON COLUMN layers.name IS 'The name of the layer
        Example: "Base Layer"';

COMMENT ON COLUMN layers.type IS 'The type of the layer (ENUM layer_type)
        Examples: base, plants, shade, ...';

COMMENT ON COLUMN layers.type IS 'Whether the layer was created by the user as an alternative to a pre-existing layer';





COMMENT ON COLUMN plantings.id IS 'This is generated by the frontend';
