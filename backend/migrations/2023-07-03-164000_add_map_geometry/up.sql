-- This migration already ran on www.permaplant.net
-- So it cannot be edited, except of comments or formatting.
-- Please create a new migration instead.

ALTER TABLE maps ADD COLUMN geometry GEOMETRY (POLYGON, 4326) NOT NULL;
