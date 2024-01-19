-- Change plant spread and height to integers, drop enum types

ALTER TABLE plants ALTER COLUMN height TYPE int USING null;
ALTER TABLE plants ALTER COLUMN spread TYPE int USING null;

DROP TYPE IF EXISTS plant_height;
DROP TYPE IF EXISTS plant_spread;
