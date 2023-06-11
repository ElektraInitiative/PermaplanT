//! Contains the implementation of [`Coordinates`].

use postgis_diesel::types::Point;

use super::Coordinates;

/// `PostGIS` identifier for latitude/longitude coordinate system.
const COORDINATE_SYSTEM: u32 = 4326;

impl From<Point> for Coordinates {
    fn from(point: Point) -> Self {
        Self {
            latitude: point.y,
            longitude: point.x,
        }
    }
}

impl From<Coordinates> for Point {
    fn from(coordinates: Coordinates) -> Self {
        Self {
            x: coordinates.longitude,
            y: coordinates.latitude,
            srid: Some(COORDINATE_SYSTEM),
        }
    }
}
